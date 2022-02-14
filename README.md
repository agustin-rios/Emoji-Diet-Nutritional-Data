# Analisis Nutricional de Alimentos representados en emoji

# Tabla de contenidos
0. [Dataset](#dataset)
1. [Composición](#composicion)
2. [Uso Herrmienta](#el-uso)

# 0. Dataset<a id="dataset"></a>

Para descargar el dataset acceda a [la siguiente pagina](https://www.kaggle.com/ofrancisco/emoji-diet-nutritional-data-sr28?select=Emoji+Diet+Nutritional+Data+%28g%29+-+EmojiFoods+%28g%29.csv).

# 1. Composición<a id="composicion"></a>

Para las tareas, es relevante tener la siguiente organización de archivos:

```
.
│   analisis.ipynb
│   informe.pdf
|   README.md
│
└───Herramienta
|   |   index.html
|   |
│   └───src
|   |   └───data\archive
|   |   └───js
|   |   └───styles
```

# 2. Uso Herramienta<a id="el-uso"></a>

Para utilizar la herramienta primero deberan acceder a los datos que se encuentran en la seccion de [Dataset](#dataset). Una vez descargados los datos deberan ubicarlos en la direccion `src\data\archive` que se encuentra dentro de la carpeta de Herramienta, tal como se muestra en la seccion de [Composición](#composicion) del repositorio.

Luego de disponer de los archivos correctamente pueden revisar los datos que se utilizaran en `analisis.ipynb` y levantar la herramienta desde dentro de la carpeta `Herramienta` y corriendo en la consola de comandos la siguiente linea:

```
python -m http.server
```

Una vez cargue el comando, en el navegador vaya a `http://localhost:8000` y disfrute la aplicacion!