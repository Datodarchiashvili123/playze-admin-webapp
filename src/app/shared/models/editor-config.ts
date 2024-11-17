export const preview = {
  selector: 'editor',
  base_url: '/tinymce',
  min_height: 448,
  toolbar: false,
  menubar: false,
  promotion: false,
  branding: false,
  resize: true,
  plugins: '',
  license_key: 'gpl',
};

export const editable = {
  license_key: 'gpl',
  selector: 'editor',
  base_url: '/tinymce',
  min_height: 448,
  toolbar: true,
  menubar: true,
  promotion: false,
  branding: false,
  resize: true,
  skin: "oxide-dark",
  content_css: "dark",
  plugins:
    'lists advlist link image table visualblocks visualchars quickbars searchreplace wordcount pagebreak accordion anchor autolink code charmap codesample directionality emoticons fullscreen help insertdatetime',
};
