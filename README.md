# Documentación
Documentación del sistema de visualización de reservas de cubículos de la biblioteca de la Universidad de Cuenca.

__Creado por:__ Luis González (luis.gonzaleza@ucuenca.edu.ec) y Roger Aguirre (roger.aguirre@ucuenca.edu.ec)

# Documentación JavaScript
Configuración en el archivo `index.js`

## Intervalo
Se define el intervalo de tiempo __(en segundos)__ de visualización de la información de cada cubículo.  

```js
const intervalo = 5 // 5 segundos
```

## Credenciales
Se define el usuario y contraseña. Debe ser un usuario existente en el sistema Booked Scheduler.

```js
const credenciales = {
    username: "biblioteca@ucuenca.edu.ec",
    password: "biblioteca2020"
}
```

## Campus
Se define en nombre del campus. Ignora las mayúsculas y minúsculas, pero debe ser el mismo del sistema de administración.

__Permitido:__ CAmpus CENtral

__No permitido:__ ccámpus central

```js
const campus = "campus central"
```

## Servidor
Se define la dirección del servidor.

```js
const servidor = "http://10.22.114.5"
```

## Número máximo de reservas
Se define la cantidad máxima de reservas que se muestra por cada cubículo.

```js
const reservas = 5
```

## Autenticación
La autenticación se realiza mediante una petición `POST` en la función __autenticarUsusario__ con la siguiente dirección:

```php
/booked/Web/Services/index.php/Authentication/Authenticate
```
Está petición requiere las `credenciales` y devuelve los datos de la sesión, de los cuales se extraen las variables `sessionToken` y `userId`, que posteriormente se agregan al __localStorage__ para mantener activa la sesión.

## Cubículos
Los cubículos se obtienen mediante una petición `GET` en la función __getCubiculos__ con la siguiente dirección:

```php
/booked/Web/Services/index.php/Resources
```
Está petición requiere los headers `X-Booked-SessionToken` y `X-Booked-UserId`, que deben contener las varibles `sessionToken` y `userId` anteriormente almacenadas en __localStorage__.

## Reservaciones
Los cubículos se obtienen mediante una petición `GET` en la función __getReservaciones__ con la siguiente dirección:

```php
/booked/Web/Services/index.php/Reservations
```
Está petición requiere los headers `X-Booked-SessionToken` y `X-Booked-UserId`, que deben contener las varibles `sessionToken` y `userId` anteriormente almacenadas en __localStorage__.

__Nota:__ en caso que el token de la sesión caduque, se refresca la página para empezar desde cero y realizar una nueva autenticación. 

# Documentación CSS

Configuración en el archivo `style.css`

## Colores
Se definen los colores para los estados __libre__ y __ocupado__. Adicionalmente se puede configurar los colores __blanco__ y __azul__.

```css
:root {
  --color-libre: #28a745;
  --color-ocupado: #a51008;
  --color-blanco: #f2f7fd;
  --color-azul-ucuenca: #002856;
}
```#