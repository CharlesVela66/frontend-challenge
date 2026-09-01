# Decisiones

> Máximo una página. Bullets están perfecto — sin adornos.
> Borra estas instrucciones cuando lo llenes.

## Qué mostré y qué dejé fuera

Incluí:
- Cards de summary para brindar un quick look del estado actual de tus gastos e ingresos del periodo
- Una tabla con todos los movimientos válidos del periodo, para que puedas ver específicamente cada movimiento
- Detalle de cada movimiento para que tengas la información completa de quién y qué gastaste/ingresaste
- Un pequeño gráfico que enseña tu distribución de gastos por categoría
- El día que más gastaste, ya que puedes recolectar esta info. para tomar decisiones futuras si identificas un patrón
- Cuánto egresaste e ingresaste este periodo
- Filtros y sorting para que la información esté presentada de una manera ordenada y puedas encontrar lo que buscas mucho más fácil

Excluí:
- Sistema de caching para persistir mejor los cambios de categoría
- Pruebas unitarias
- Algoritmo que me ayudara a cambiar automáticamente la categoría basado en una predicción de los datos ya existentes

## Supuestos que tuve que inventar

_Lo que el requerimiento no decía y resolviste por tu cuenta._

La verdad es que el requerimiento estaba muy straigh-forward y directo. Creo que fueron más que nada los detalles que inferí:

- Paginación, filtros y sorting. Los incluí porque esto le agrega calidad y mejor experiencia de usuario a las personas que están viendo su historial de movimientos en el periodo. Hace la búsqueda mucho más fácil.
- Buena estructura de archivos: Creo que es importante presentar los archivos de una manera ordenada, a pesar de la limitante de 4 horas. Creo que hice un gran trabajo con el tiempo que tuve para hacer que los archivos fueran lo más claro y atómico posible.
- No persistencia de los cambios: Como no se pidió nada de backend, implementé la funcionalidad de cambiar la categoría pero ésta misma cambia una vez que recargas la página, debido a que no hay ningún sistema de persistencia (base de datos) detrás. Como es un reto puramente de frontend, decidí que esto era correcto.

## Qué encontré en los datos y cómo lo manejé

_El JSON no viene limpio. ¿Qué venía mal y qué hiciste al respecto?_

- Movimientos con monto === 0
- Movimientos duplicados (dos mismos montos con la misma información a la misma hora)
- Inconsistencia en el tipado de los datos (montos tipo string, categorias nulas o empty strings)
- Categorías inconsistentes (para movimientos de farmacias era salud o entretenimiento)
- Cuenta nula
- 4 tipos de estado
- Un movimiento del año pasado
- Un movimiento en USD

Lo que hice al respecto es de que justo cuando se hace el fetch de movimientos.json, se hace la sanitización de los datos y se ignoran (no eliminan) los datos que no cumplan con las siguientes reglas:
- No viene en el formato correcto (se usó zod para el schema validation)
- Pasara la verificación de datos (si hay una cuenta, monto !== 0, está dentro del periodo correcto)
- Normalizar categoría
- No existen duplicados (si hay, se deja el que tenga "confirmed")

## Cómo usé IA

_Qué herramienta, en qué te ayudó, qué generó que tuviste que corregir o tirar._

Utilicé la IA en todo el proceso. Me ayudó mucho para idear un plan de implementación inicial y programar todo el código. Siempre priorizo que los planes de implementación estén divididos en fases para que pueda revisar el código manualmente entre cada fase, hacer ligeras modificaciones y correrlo. 

Utilicé Claude y Claude Code para diseñar e implementar. 

Al principio pensé que tener un banner principal agregaría mucho valor al usuario. Viendo el resultado final, decidí eliminarlo ya que tantos números en la presentación podía confundir al usuario. También, cuando me entregó la tabla, yo esperaba que ya estuviera pagina y con filtros. Sin embargo, no lo estaba. Eso fue un error de mi parte inicialmente en no pedirselo, pero sí lo consideré importante y actualizamos el plan acorde a eso.

## Qué haría con una semana más

- Mejorar el UI, ya que todo es muy blanco y negro y es muy blando
- Implementar un sistema backend para persistir los cambios de categoría.
- Cuando cambies una categoría, mostrar un toast que el cambio de categoría fue exitoso
- Agregar más gráficas que ayuden al usuario a entender su situación financiera actual (pensé en hacer una gráfica de pastel con sus ingresos y egresos, creo que eso hubiera estado bastante cool)
- El algoritmo que mencioné que corrige la categoría de cada movimiento en caso de ser necesario
- Conversion Rate API Integration: Integrar una API que me de accurate conversion rates diarios, para mostrar las conversiones de una manera más precisa. Estos rates se deben de persistir en la base de datos, porque obviamente el rate de hoy no es el mismo que el de hace un mes, para mostrar las cantidades correctas.
- Multi-currency support: permitir que el usuario vea sus transacciones en la moneda donde se encuentra ubicado


## Tiempo invertido

_El time-box es de 4 horas. Si te quedaste corto, dilo aquí — también cuenta._

Por el momento llevo 3.18 horas, así que yo creo que si hago el deploy.

El desglose de las horas se encuentra [aquí](https://docs.google.com/spreadsheets/d/1fypkULEc7jPTX62itTW6o_zKrU39UbKrUVAq8laueZY/edit?usp=sharing)
