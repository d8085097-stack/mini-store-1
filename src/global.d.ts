declare module "*.css";
 
// Teach TypeScript about CSS Modules (*.module.css)
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
 