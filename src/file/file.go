package file

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path"
	"regexp"
	"strconv"
	"strings"
	"syscall"
)

type File struct {
	ctx *context.Context
}

func New(context *context.Context) *File {
	return &File{context}
}

func (f *File) ErrorLog(err error) {
	runtime.LogError(*f.ctx, err.Error())
}

func (f *File) WriteFile(path string, content string) error {
	return os.WriteFile(path, []byte(content), fs.ModePerm)
}

func (f *File) ReadFile(path string) (string, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		f.ErrorLog(err)
		return "", err
	}
	return string(content), nil
}

type FileInfo struct {
	Name           string
	Size           int64
	ModTime        int64
	Hash           string
	CreationTime   int64
	LastAccessTime int64
	LastWriteTime  int64
}

func (f *File) GetFilesInfo(dir string) ([]FileInfo, error) {
	files, err := os.ReadDir(dir)
	var list []FileInfo
	if err != nil {
		return list, err
	}
	for _, file := range files {
		if !file.IsDir() {
			f, err := file.Info()
			if err != nil {
				return list, err
			}
			md5Hash, err := getFileMD5(path.Join(dir, file.Name()))
			if err != nil {
				fmt.Println(err.Error())
			}
			var creationTime int64
			var lastAccessTime int64
			var lastWriteTime int64
			sys := f.Sys()
			if sys != nil {
				winSys, ok := sys.(*syscall.Win32FileAttributeData)
				if ok {
					creationTime = winSys.CreationTime.Nanoseconds()
					lastAccessTime = winSys.LastAccessTime.Nanoseconds()
					lastWriteTime = winSys.LastWriteTime.Nanoseconds()
				}
			}
			list = append(list, FileInfo{
				Name:           f.Name(),
				ModTime:        f.ModTime().Unix(),
				Size:           f.Size(),
				Hash:           md5Hash + "_" + f.Name(),
				CreationTime:   creationTime,
				LastAccessTime: lastAccessTime,
				LastWriteTime:  lastWriteTime,
			})
		}
	}
	return list, nil
}

func getFileMD5(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()
	hasher := md5.New()
	if _, err := io.Copy(hasher, file); err != nil {
		return "", err
	}
	return hex.EncodeToString(hasher.Sum(nil)), nil
}

type HashFileInfo struct {
	path    string
	newPath string
}

func (f *File) BathRename(files []FileInfo, dir string) error {
	numFiles := len(files)
	formatLength := len(strconv.Itoa(numFiles))
	var hashFiles []HashFileInfo
	for index, file := range files {
		ext := path.Ext(file.Name)
		filePath := path.Join(dir, file.Name)
		newName := fmt.Sprintf("%0*d%s", formatLength, index+1, ext)
		newPath := path.Join(dir, newName)
		if filePath == newPath {
			continue
		}
		hashPath := path.Join(dir, file.Hash+ext)
		hashFiles = append(hashFiles, HashFileInfo{
			path:    hashPath,
			newPath: newPath,
		})
		if filePath == hashPath {
			continue
		}
		err := os.Rename(filePath, hashPath)
		if err != nil {
			return err
		}
	}
	for _, hashFile := range hashFiles {
		err := os.Rename(hashFile.path, hashFile.newPath)
		if err != nil {
			return err
		}
	}
	return nil
}

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

var fileServiceReg, _ = regexp.Compile("^wails-local/")

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	var err error
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	requestedFilename = fileServiceReg.ReplaceAllString(requestedFilename, "")
	fileData, err := os.ReadFile(requestedFilename)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
	}
	res.Write(fileData)
}
