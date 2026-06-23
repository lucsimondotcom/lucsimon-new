export const CRITICAL_LOADER_CSS = `
body:not(.site-preparing):not(.site-ready) {
  overflow: hidden;
  background: #F5F5F5;
}
body:not(.site-preparing):not(.site-ready) #site-app,
body:not(.site-preparing):not(.site-ready) #site-scrollbar {
  display: none !important;
}
body.site-preparing:not(.site-ready) {
  overflow: hidden;
}
`;
