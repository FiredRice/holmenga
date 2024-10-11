package tool

import (
	"errors"
	"io/fs"
	"os"
)

// @function: PathExists
// @description: 文件目录是否存在
// @param: path string
// @return: bool, error
func PathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

// @function: CreateFile
// @description: 创建文件
// @param: filename string
// @return: os.File, error
func CreateFile(filename string) (*os.File, error) {
	exist, err := PathExists(filename)
	if err != nil {
		return nil, err
	}
	if exist {
		return nil, errors.New("file already exist")
	} else {
		return os.Create(filename)
	}
}

func MkdirAll(path string, perm fs.FileMode) error {
	if ok, _ := PathExists(path); !ok {
		return os.MkdirAll(path, perm)
	}
	return nil
}
