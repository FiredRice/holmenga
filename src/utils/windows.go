package tool

import "syscall"

// 获取屏幕缩放比例
func ScreenScale() float64 {
	var (
		user32           = syscall.MustLoadDLL("user32.dll")
		GetDC            = user32.MustFindProc("GetDC")
		GetSystemMetrics = user32.MustFindProc("GetSystemMetrics")
		releaseDC        = user32.MustFindProc("ReleaseDC")
		gdi32            = syscall.MustLoadDLL("gdi32.dll")
		GetDeviceCaps    = gdi32.MustFindProc("GetDeviceCaps")
	)
	hdc, _, _ := GetDC.Call(0)
	defer releaseDC.Call(hdc)
	sw, _, _ := GetSystemMetrics.Call(0)
	dw, _, _ := GetDeviceCaps.Call(hdc, uintptr(118))
	return float64(dw) / float64(sw)
}