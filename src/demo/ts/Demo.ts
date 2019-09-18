import Plugin from '../../main/ts/Plugin';

declare let tinymce: any;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'code paste-it-cleaned-tiny',
  toolbar: 'paste-it-cleaned-tiny'
});
