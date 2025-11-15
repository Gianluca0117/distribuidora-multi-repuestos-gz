import fs from "fs";
import path from "path";

const __dirname = process.cwd();

// Carpeta donde están tus imágenes de productos
const IMAGES_DIR = path.join(__dirname, "img", "productos");

// Archivo de salida
const OUTPUT_FILE = path.join(__dirname, "js", "products-data.js");

// Extensiones válidas
const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function toTitle(str) {
  // "disco-de-freno-ventilado-260mm" -> "Disco de freno ventilado 260mm"
  return str
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}

function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`No existe la carpeta ${IMAGES_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(IMAGES_DIR)
    .filter((file) => VALID_EXT.includes(path.extname(file).toLowerCase()));

  const products = [];
  let idCounter = 1;

  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext); // nombre sin extensión

    // Esperamos: categoria__nombre__precio__tag
    const parts = base.split("__");
    if (parts.length < 4) {
      console.warn(`⚠️ Nombre inválido (se esperaban 4 partes): ${file}`);
      continue;
    }

    const [categoryRaw, nameRaw, priceRaw, tagRaw] = parts;

    const category = categoryRaw.toLowerCase();
    const name = toTitle(nameRaw);
    const tag = toTitle(tagRaw);

    const price = parseFloat(priceRaw.replace(",", "."));
    if (Number.isNaN(price)) {
      console.warn(`⚠️ Precio inválido en archivo: ${file}`);
      continue;
    }

    const product = {
      id: idCounter++,
      name,
      category,
      price,
      image: `img/productos/${file}`,
      stock: 10, // stock por defecto, puedes cambiarlo
      tag,
    };

    products.push(product);
  }

  const header =
    `// Archivo generado automáticamente por tools/generate-products.mjs\n` +
    `// NO editar a mano. Modifica las imágenes en img/productos y vuelve a ejecutar el script.\n\n`;

  const content =
    header +
    "const products = " +
    JSON.stringify(products, null, 2) +
    ";\n";

  fs.writeFileSync(OUTPUT_FILE, content, "utf8");
  console.log(`✅ Generado ${OUTPUT_FILE} con ${products.length} productos.`);
}

main();
