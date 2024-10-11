package file

import (
	"archive/zip"
	"io"
	"os"
	"path"
	"path/filepath"
	"strings"
	"sync"
)

type SafeFile struct {
	file   *os.File
	closed bool
	mu     sync.Mutex
}

func (sf *SafeFile) Close() error {
	sf.mu.Lock()
	defer sf.mu.Unlock()
	if sf.closed {
		return nil // 已经关闭了，返回 nil
	}
	err := sf.file.Close()
	sf.closed = true
	return err
}

func NewSafeFile(filename string) (*SafeFile, error) {
	f, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	return &SafeFile{file: f}, nil
}

// 递归遍历文件夹并添加到zip文件
func addFilesToZip(w *zip.Writer, folder string, basePath string, remove bool) error {
	// 打开文件夹
	files, err := os.ReadDir(folder)
	if err != nil {
		return err
	}

	for _, file := range files {
		filePath := filepath.Join(folder, file.Name())
		if file.IsDir() {
			// 如果是文件夹，则递归调用
			if err := addFilesToZip(w, filePath, basePath, remove); err != nil {
				return err
			}
			if remove {
				err = os.Remove(filePath)
				if err != nil {
					return err
				}
			}
		} else {
			// 如果是文件，则添加到zip文件
			if err := addFileToZip(w, filePath, basePath, remove); err != nil {
				return err
			}
		}
	}
	return nil
}

// 将单个文件添加到zip文件
func addFileToZip(w *zip.Writer, filePath string, basePath string, remove bool) error {
	// 打开文件
	file, err := NewSafeFile(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// 获取文件相对于基础路径的路径
	relativePath, err := filepath.Rel(basePath, filePath)
	if err != nil {
		return err
	}

	// 创建zip文件中的文件
	zipFile, err := w.Create(relativePath)
	if err != nil {
		return err
	}

	// 将文件内容复制到zip文件
	_, err = io.Copy(zipFile, file.file)

	if err != nil {
		return err
	}

	file.Close()

	if remove {
		err = os.Remove(filePath)
	}

	return err
}

type ZipConfig struct {
	Dir    string `json:"dir"`
	Remove bool   `json:"remove"`
}

func zipFolder(config *ZipConfig) error {
	zipFilePath := config.Dir + ".zip"
	zipFile, err := os.Create(zipFilePath)
	if err != nil {
		return err
	}
	defer zipFile.Close()

	// 创建zip.Writer
	writer := zip.NewWriter(zipFile)
	defer writer.Close()

	// 将文件夹添加到zip文件
	basePath, _ := filepath.Abs(config.Dir)
	if err := addFilesToZip(writer, config.Dir, basePath, config.Remove); err != nil {
		return err
	}
	return nil
}

func (f *File) ZipFolder(config *ZipConfig) error {
	err := zipFolder(config)
	if err != nil {
		return err
	}

	// 移动文件到文件夹
	zipFilePath := config.Dir + ".zip"
	zipName := path.Base(strings.ReplaceAll(zipFilePath, "\\", "/"))
	err = os.Rename(zipFilePath, path.Join(config.Dir, zipName))
	return err
}
