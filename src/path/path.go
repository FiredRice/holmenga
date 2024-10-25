package path

import (
	"context"
	tool "holmenga/src/utils"
	rp "path"
)

type Path struct {
	ctx *context.Context
}

func New(context *context.Context) *Path {
	return &Path{context}
}

func (p *Path) PathExists(path string) (bool, error) {
	return tool.PathExists(path)
}

func (p *Path) Dir(path string) string {
	return rp.Dir(path)
}
