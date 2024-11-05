package store

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Size struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}

type WindowsStore struct {
	Pos        Point `json:"pos"`
	Size       Size  `json:"size"`
	IsMaximise bool  `json:"isMaximise"`
	Log        bool  `json:"log"`
}

type Config struct {
	ScrollAnim bool `json:"scrollAnim"`
}