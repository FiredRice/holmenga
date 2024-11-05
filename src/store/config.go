package store

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
)

var configPath = "data/config.json"

func NewConfig() (*Config, error) {
	content, err := os.ReadFile(configPath)
	if err != nil {
		return &Config{}, err
	}
	var config Config
	err = json.Unmarshal(content, &config)
	if err != nil {
		fmt.Println(err.Error())
		return &Config{}, err
	}
	return &config, nil
}

func (c *Config) Save() error {
	jsonBytes, err := json.Marshal(c)
	if err != nil {
		return err
	}
	err = os.WriteFile(configPath, jsonBytes, fs.ModePerm)
	if err != nil {
		return err
	}
	return nil
}
