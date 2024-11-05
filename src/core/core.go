package core

import (
	"context"
	"github.com/fstanis/screenresolution"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"holmenga/src/store"
	tool "holmenga/src/utils"
)

// App struct
type App struct {
	ctx    context.Context
	store  *store.Store
	config *store.Config
}

// NewApp creates a new App application struct
func New() *App {
	appStore, err := store.NewStore()
	if err != nil {
		println(err.Error())
	}
	config, err := store.NewConfig()
	if err != nil {
		println(err.Error())
	}

	return &App{
		store:  appStore,
		config: config,
	}
}

func (a *App) Context() *context.Context {
	return &a.ctx
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	// 加载配置
	a.loadConfig()
}

// 加载配置
func (a *App) loadConfig() {
	pos, err := a.store.GetPos()
	if err != nil {
		runtime.LogInfo(a.ctx, err.Error())
		return
	}
	if a.store.GetIsMaximise() {
		runtime.WindowMaximise(a.ctx)
	} else {
		runtime.WindowSetPosition(a.ctx, pos.X, pos.Y)
		size, _ := a.store.GetSize()
		runtime.WindowSetSize(a.ctx, size.Width, size.Height)
	}
}

func (a *App) ScreenScale() float64 {
	return tool.ScreenScale()
}

func (a *App) ScreenResolution() *screenresolution.Resolution {
	return screenresolution.GetPrimary()
}

func (a *App) GetConfig() *store.Config {
	return a.config
}

func (a *App) BeforeClose(ctx context.Context) bool {
	isMaximised := runtime.WindowIsMaximised(ctx)
	a.store.SetIsMaximise(isMaximised)
	x, y := runtime.WindowGetPosition(ctx)
	a.store.SetPos(x, y)
	width, height := runtime.WindowGetSize(ctx)
	a.store.SetSize(width, height)
	err := a.store.Save()
	if err != nil {
		runtime.LogInfo(ctx, err.Error())
	}
	err = a.config.Save()
	if err != nil {
		runtime.LogInfo(ctx, err.Error())
	}
	return false
}
