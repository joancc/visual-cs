 // HTLM EDITOR
 var editor_html = ace.edit("html_editor");
 editor_html.setTheme("ace/theme/monokai");
 editor_html.getSession().setMode("ace/mode/html");
 // Hide vertical ruler
 editor_html.setOption("printMargin", 10);
 editor_html.setOption("showPrintMargin", false);
 editor_html.setValue('<h2>Multiple 1 Enemies</h2><canvas id="myCanvas" width="600" height="400" style="background:#cccccc;"></canvas>');
 // JS EDITOR
 var editor_js = ace.edit("js_editor");
 editor_js.setTheme("ace/theme/monokai");
 editor_js.getSession().setMode("ace/mode/javascript");
 // Hide vertical ruler
 editor_js.setOption("printMargin", 10);
 editor_js.setOption("showPrintMargin", false);
 editor_js.setValue("var x = 0; alert(x+12);");

 // CSS EDITOR
 var editor_css = ace.edit("css_editor");
 editor_css.setTheme("ace/theme/monokai");
 editor_css.getSession().setMode("ace/mode/css");
 // Hide vertical ruler
 editor_css.setOption("printMargin", 10);
 editor_css.setOption("showPrintMargin", false);
 editor_css.setValue("h1{color: red;}");

 // LIVE PREVIEW
 var view = $('#preview');

 var js_content = editor_js.getValue();
 var css_content = editor_css.getValue();
 var html_content = editor_html.getValue();

 //Refresh executes after 2s of inactivity
 var refreshPreviewTimeout;

 function refreshPreview() {
     clearTimeout(refreshPreviewTimeout);
     refreshPreviewTimeout = setTimeout(function() {
         console.log("Refreshing view");

         css_content = editor_css.getValue();
         html_content = editor_html.getValue();
         js_content = editor_js.getValue();

         sendMessageToPreview({
            html: html_content,
            css: css_content,
            js: js_content
         });
         // view.contents().find('body').html("<style>" + css_content + "</style>" + html_content + "<script>"+js_content+"</script>");
        
        
        


         // var script = document.createElement('script');
         // try {
         //     script.appendChild(document.createTextNode(js_content));
         //     view.contents().find('body').appendChild(script);
         // } catch (e) {
         //     script.text = js_content;
         //     document.body.appendChild(script);
         //     console.log("Error from ace_editors");
         //     console.log(e);
         // }

         //Error checking (provide user feedback)
         // try {
         //     //Eval the code to overwrite existing function. Access the iframe by name
         //     preview.eval(js_content);
         // } catch (err) {
         //     // ReferenceError: alph is not defined
         //     console.log(err);
         //     alert("Make sure you've defined your variable before trying to use it");
         // }
     }, 2000);
 }

 editor_html.getSession().on('change', function() {
     refreshPreview();
 });
 editor_js.getSession().on('change', function() {
     refreshPreview();
 });
 editor_css.getSession().on('change', function() {
     refreshPreview();
 });


 


