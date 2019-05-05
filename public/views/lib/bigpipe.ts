class Bigpipe {

    callbacks: { [key: string]: any };

    constructor() {
        this.callbacks = {};
    }

    ready(key: string,callback: any){
        if(!this.callbacks[key]){
            this.callbacks[key]=[];
        }
        this.callbacks[key].push(callback);
    }

    set(key: string,data: any){
        var callbacks=this.callbacks[key]||[];
        for(var i=0;i<callbacks.length;i++){
            callbacks[i].call(this,data);
        }
    }

}

export const bigpipe = new Bigpipe();
(<any>window).bigpipe =  bigpipe;
// export = bigpipe;
