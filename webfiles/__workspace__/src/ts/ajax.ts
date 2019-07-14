export interface IAjax {
    url : string,
    contents? : Object,
    type? : string,
    passthrough? : Object,
    on_progress? : (event : any, passthrough? : Object) => void,
    on_complete? : (response : string, passthrough? : Object) => void
};

export class AjaxHandler {
    private should_cache : boolean;

    constructor(shoud_cache : boolean) {
        this.should_cache = shoud_cache;
    }

    send(params : IAjax) : void {
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                if (params.on_complete !== undefined)
                    params.on_complete(xmlhttp.responseText, params.passthrough);
        };

        xmlhttp.onprogress = (event) => {
            if (params.on_progress !== undefined)
                params.on_progress(event, params.passthrough)
        };

        if (this.should_cache === false)
            params.url += '?nocache=' + Math.random() * 1000000

        if (params.type === undefined)
            params.type = 'get'

        let form_data = new FormData();
        form_data.append('data', JSON.stringify(params.contents));

        xmlhttp.open(params.type, params.url);
        xmlhttp.send(form_data);
    };
}