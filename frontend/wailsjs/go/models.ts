export namespace file {
	
	export class FileInfo {
	    Name: string;
	    Size: number;
	    ModTime: number;
	    Hash: string;
	    CreationTime: number;
	    LastAccessTime: number;
	    LastWriteTime: number;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Size = source["Size"];
	        this.ModTime = source["ModTime"];
	        this.Hash = source["Hash"];
	        this.CreationTime = source["CreationTime"];
	        this.LastAccessTime = source["LastAccessTime"];
	        this.LastWriteTime = source["LastWriteTime"];
	    }
	}
	export class ZipConfig {
	    dir: string;
	    remove: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ZipConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dir = source["dir"];
	        this.remove = source["remove"];
	    }
	}

}

export namespace frontend {
	
	export class FileFilter {
	    DisplayName: string;
	    Pattern: string;
	
	    static createFrom(source: any = {}) {
	        return new FileFilter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.DisplayName = source["DisplayName"];
	        this.Pattern = source["Pattern"];
	    }
	}
	export class OpenDialogOptions {
	    DefaultDirectory: string;
	    DefaultFilename: string;
	    Title: string;
	    Filters: FileFilter[];
	    ShowHiddenFiles: boolean;
	    CanCreateDirectories: boolean;
	    ResolvesAliases: boolean;
	    TreatPackagesAsDirectories: boolean;
	
	    static createFrom(source: any = {}) {
	        return new OpenDialogOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.DefaultDirectory = source["DefaultDirectory"];
	        this.DefaultFilename = source["DefaultFilename"];
	        this.Title = source["Title"];
	        this.Filters = this.convertValues(source["Filters"], FileFilter);
	        this.ShowHiddenFiles = source["ShowHiddenFiles"];
	        this.CanCreateDirectories = source["CanCreateDirectories"];
	        this.ResolvesAliases = source["ResolvesAliases"];
	        this.TreatPackagesAsDirectories = source["TreatPackagesAsDirectories"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace screenresolution {
	
	export class Resolution {
	    Width: number;
	    Height: number;
	
	    static createFrom(source: any = {}) {
	        return new Resolution(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Width = source["Width"];
	        this.Height = source["Height"];
	    }
	}

}

export namespace store {
	
	export class Config {
	    scrollAnim: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.scrollAnim = source["scrollAnim"];
	    }
	}

}

