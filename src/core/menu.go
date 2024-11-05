package core

import (
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func NewMenu(app *App) *menu.Menu {
	appMenu := menu.NewMenu()

	configMenu := appMenu.AddSubmenu("配置")
	configMenu.AddCheckbox("滚动动画", app.config.ScrollAnim, nil, func(_ *menu.CallbackData) {
		app.config.ScrollAnim = !app.config.ScrollAnim
		runtime.EventsEmit(app.ctx, "scroll-anim-chenge", app.config.ScrollAnim)
	})

	return appMenu
}
