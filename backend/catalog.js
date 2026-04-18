const CATEGORY_ORDER = [
    'Entradas',
    'Patacones',
    'Perros Calientes',
    'Hamburguesas',
    'Salchipapas',
    'Menu Infantil',
    'Especiales',
    'Adiciones',
    'Bebidas',
    'Sodas Italianas'
];

const CATEGORY_IMAGES = {
    'Entradas': 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80',
    'Patacones': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=1200&q=80',
    'Perros Calientes': 'https://images.unsplash.com/photo-1612392061787-2d078b5d1354?auto=format&fit=crop&w=1200&q=80',
    'Hamburguesas': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    'Salchipapas': 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=80',
    'Menu Infantil': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=80',
    'Especiales': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    'Adiciones': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80',
    'Bebidas': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80',
    'Sodas Italianas': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80'
};

const RAW_PRODUCT_CATALOG = [
    { categoria: 'Entradas', nombre: 'Papas de la Casa', precio: 15900, descripcion: '150 gr de papas francesas, trozos de platano maduro melado picados y salsa de tocineta.' },
    { categoria: 'Entradas', nombre: 'Dedos de Queso', precio: 10900, descripcion: 'Cuatro deditos de queso apanados artesanales acompanados de salsa de tocineta.' },
    { categoria: 'Entradas', nombre: 'Patacones con Cuajada', precio: 8900, descripcion: 'Porcion de patacones servida con cuajada campesina.' },

    { categoria: 'Patacones', nombre: 'Pisao', precio: 23900, descripcion: 'Patacon con base de verduras, papa ripio, carne desmechada, pollo desmechado, chorizo, maiz tierno, cuajada, huevo de codorniz y salsas de la casa.' },
    { categoria: 'Patacones', nombre: 'Tramuca', precio: 21900, descripcion: 'Patacon con base de verduras, papa ripio, pollo desmechado, tocineta, maiz tierno, salsa blanca, huevo de codorniz y cuajada.' },
    { categoria: 'Patacones', nombre: 'Crunch', precio: 45900, descripcion: 'Base de papa francesa con queso mozzarella, panceta, guacamole, chorizo, carne de hamburguesa, chips de platano y finas hierbas.' },
    { categoria: 'Patacones', nombre: 'Andale', precio: 21500, descripcion: 'Patacon con base de verduras, papa ripio, carne desmechada, jalapenos, salsa de guacamole, chorizo, huevo de codorniz y mix de salsas.' },
    { categoria: 'Patacones', nombre: 'Callejero', precio: 27400, descripcion: 'Patacon con papa ripio, salchicha americana, carne de res asada, salsa de la casa, tocineta, cuajada y huevo de codorniz.' },

    { categoria: 'Perros Calientes', nombre: 'Sencillo', precio: 12900, descripcion: 'Salchicha americana, salsas de la casa, cebolla, papa ripio y queso mozzarella.' },
    { categoria: 'Perros Calientes', nombre: 'Wey', precio: 15900, descripcion: 'Salchicha americana, cebolla, salsa de guacamole, salsas de la casa, queso y carne desmechada.' },
    { categoria: 'Perros Calientes', nombre: 'Campesino', precio: 14500, descripcion: 'Salchicha americana, cebolla, papa ripio, salsas de la casa, maiz tierno, tocineta y queso mozzarella.' },

    { categoria: 'Hamburguesas', nombre: 'Clasica', precio: 16000, descripcion: 'Pan artesanal, 150 gr de carne, tomate, lechuga, cebolla grille, queso mozzarella y salsas de la casa.' },
    { categoria: 'Hamburguesas', nombre: 'La Tipica', precio: 20900, descripcion: 'Pan artesanal, 150 gr de carne, tomate, lechuga, cebolla grille, queso mozzarella, tocineta, huevo frito y salsas de la casa.' },
    { categoria: 'Hamburguesas', nombre: 'La del Campo', precio: 18900, descripcion: 'Pan artesanal, 150 gr de carne, lechuga, tomate, cebolla morada, queso mozzarella, maiz tierno, jamon ahumado y salsas de la casa.' },
    { categoria: 'Hamburguesas', nombre: 'Mexicana', precio: 17900, descripcion: 'Pan artesanal, 150 gr de carne, lechuga, tomate, cebolla morada, queso mozzarella, jalapenos y salsa de guacamole.' },
    { categoria: 'Hamburguesas', nombre: 'Burger XL', precio: 29900, descripcion: 'Pan artesanal, doble carne de hamburguesa, tomate, lechuga, cebolla grille, tajadas de maduro, deditos de queso y salsa de la casa.' },
    { categoria: 'Hamburguesas', nombre: 'Tropical', precio: 21900, descripcion: 'Pan artesanal, 150 gr de carne, lechuga, tomate, cebolla morada, pina caramelizada, tocineta y salsa de la casa.' },
    { categoria: 'Hamburguesas', nombre: 'Burger Apanada', precio: 23900, descripcion: 'Pan artesanal, doble filete de pollo apanado, lechuga, tomate, salsa mostaza miel y cebolla morada.' },

    { categoria: 'Salchipapas', nombre: 'Salchipisaito', precio: 14900, descripcion: '200 gr de papa francesa, papa ripio, salchicha americana, queso derretido y salsas de la casa.' },
    { categoria: 'Salchipapas', nombre: 'Salchipisao', precio: 16900, descripcion: '200 gr de papa francesa, papa ripio, salchicha americana, maiz tierno, tocineta, queso derretido y salsas de la casa.' },
    { categoria: 'Salchipapas', nombre: 'El Cuate', precio: 18900, descripcion: '200 gr de papa francesa, papa ripio, salchicha americana, carne desmechada, guacamole, jalapeno, cebolla, queso derretido y salsas.' },
    { categoria: 'Salchipapas', nombre: 'Dual Papa', precio: 36900, descripcion: '400 gr de papa francesa, papa ripio, salchicha americana, chorizo, maduro, tocineta ahumada, huevos de codorniz, pico de gallo y queso derretido.' },

    { categoria: 'Menu Infantil', nombre: 'Nuggets de Pollo', precio: 14500, descripcion: 'Trozos de pollo apanados artesanales con papas francesas y jugo de caja.' },
    { categoria: 'Menu Infantil', nombre: 'Hamburguesa', precio: 12900, descripcion: '100 gr de carne artesanal con pan, acompanada de papa francesa y jugo de caja.' },

    { categoria: 'Especiales', nombre: 'Mazorcada', precio: 21900, descripcion: 'Base de papa francesa, lechuga, tomate, cebolla, papa ripio, pollo en trozos, carne desmechada, maiz tierno, chorizo, cuajada y huevo de codorniz.' },
    { categoria: 'Especiales', nombre: 'Mazorcada Especial', precio: 39900, descripcion: 'Base de papa francesa, lechuga, tomate, cebolla, papa ripio, cerdo, pollo, chorizo, maiz tierno, queso derretido, huevos de codorniz y tocineta.' },
    { categoria: 'Especiales', nombre: 'Picada Burger', precio: 26900, descripcion: 'Papa francesa, lechuga, tomate, cebolla, papa ripio, carne de hamburguesa, platano picado, maiz tierno, salchicha americana, tocineta y cuajada.' },
    { categoria: 'Especiales', nombre: 'Picada para Dos o Tres', precio: 49900, descripcion: 'Papa francesa, yuca, arepa, carne de res, carne de hamburguesa, cerdo, salchicha americana, tocineta y patacones.' },
    { categoria: 'Especiales', nombre: 'Picada Familiar', precio: 149900, descripcion: 'Picada grande para compartir en familia con variedad de carnes y acompanamientos.' },
    { categoria: 'Especiales', nombre: 'Pechuga a la Plancha Gratinada', precio: 24900, descripcion: 'Pechuga a la plancha gratinada servida como especial de la casa.' },
    { categoria: 'Especiales', nombre: 'Churrasco', precio: 32900, descripcion: 'Corte de res servido como especial de la casa.' },
    { categoria: 'Especiales', nombre: 'Ensalada Fitness', precio: 21500, descripcion: 'Lechuga, queso en rollos, tomate cherry, pechuga, vinagreta y crutones.' },

    { categoria: 'Adiciones', nombre: 'Papa Francesa', precio: 6000, descripcion: 'Porcion adicional de papa francesa.' },
    { categoria: 'Adiciones', nombre: 'Queso', precio: 4500, descripcion: 'Adicion de queso.' },
    { categoria: 'Adiciones', nombre: 'Salchicha', precio: 4500, descripcion: 'Adicion de salchicha.' },
    { categoria: 'Adiciones', nombre: 'Carne de Hamburguesa', precio: 6000, descripcion: 'Adicion de carne de hamburguesa.' },
    { categoria: 'Adiciones', nombre: 'Huevos de Codorniz', precio: 3000, descripcion: 'Adicion de huevos de codorniz.' },
    { categoria: 'Adiciones', nombre: 'Chips de Platano', precio: 5000, descripcion: 'Adicion de chips de platano.' },
    { categoria: 'Adiciones', nombre: 'Huevo Frito', precio: 3000, descripcion: 'Adicion de huevo frito.' },

    { categoria: 'Bebidas', nombre: 'Cholupa', precio: 7000, descripcion: 'Bebida natural de cholupa.' },
    { categoria: 'Bebidas', nombre: 'Maracuya', precio: 6000, descripcion: 'Bebida natural de maracuya.' },
    { categoria: 'Bebidas', nombre: 'Limonada Hierbabuena', precio: 7000, descripcion: 'Limonada preparada con hierbabuena.' },
    { categoria: 'Bebidas', nombre: 'Limonada de Coco', precio: 8000, descripcion: 'Limonada cremosa de coco.' },
    { categoria: 'Bebidas', nombre: 'Cerezada', precio: 8000, descripcion: 'Bebida cerezada de la casa.' },
    { categoria: 'Bebidas', nombre: 'Cerveza Michelada', precio: 7000, descripcion: 'Cerveza michelada.' },

    { categoria: 'Sodas Italianas', nombre: 'Frutos Verdes', precio: 12000, descripcion: 'Soda italiana sabor frutos verdes.' },
    { categoria: 'Sodas Italianas', nombre: 'Frutos Amarillos', precio: 12000, descripcion: 'Soda italiana sabor frutos amarillos.' },
    { categoria: 'Sodas Italianas', nombre: 'Frutos Rojos', precio: 12000, descripcion: 'Soda italiana sabor frutos rojos.' }
];

const PRODUCT_CATALOG = RAW_PRODUCT_CATALOG.map((product) => ({
    ...product,
    imagen: CATEGORY_IMAGES[product.categoria] || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80'
}));

module.exports = {
    CATEGORY_ORDER,
    PRODUCT_CATALOG
};
