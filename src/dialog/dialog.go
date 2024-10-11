package dialog

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Dialog struct {
	ctx *context.Context
}

func New(context *context.Context) *Dialog {
	return &Dialog{ctx: context}
}

func (d *Dialog) OpenDirectory(options runtime.OpenDialogOptions) (string, error) {
	return runtime.OpenDirectoryDialog(*d.ctx, options)
}

func (d *Dialog) ShowErrorDialog(message string) {
	ShowErrorDialog(*d.ctx, message)
}

func ShowErrorDialog(ctx context.Context, message string) {
	runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
		Title:         "Error Occured",
		Message:       message,
		Type:          runtime.ErrorDialog,
		DefaultButton: "确定",
	})
}
