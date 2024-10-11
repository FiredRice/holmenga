package main

import (
	"holmenga/src/core"
	"holmenga/src/dialog"
	"holmenga/src/file"
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	// Create an instance of the app structure
	app := core.New()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Holmenga",
		Width:     800,
		Height:    600,
		MinWidth:  640,
		MinHeight: 480,
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: file.NewFileLoader(),
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		OnBeforeClose:    app.BeforeClose,
		Bind: []interface{}{
			app,
			file.New(app.Context()),
			dialog.New(app.Context()),
		},
		Windows: &windows.Options{
			WebviewUserDataPath: "./cache",
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
