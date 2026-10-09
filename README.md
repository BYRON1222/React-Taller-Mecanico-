# Sistema de Taller Mecánico (React)

Aplicación web hecha con **React 18 + Vite** para gestionar clientes, vehículos,
servicios y órdenes de trabajo de un taller mecánico. Los datos se guardan en el
navegador (localStorage), así que no necesita backend ni base de datos.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abrir la URL que muestra la terminal (normalmente http://localhost:5173).

## Funcionalidad

- **Clientes**: crear, editar y eliminar.
- **Vehículos**: pertenecen a un cliente; la placa no se puede repetir.
- **Servicios**: catálogo con precios (viene con 5 de ejemplo).
- **Órdenes**: se asocian a un vehículo y a uno o más servicios; el total se calcula
  automáticamente y el estado avanza `pendiente -> en proceso -> finalizada`.
  Se pueden filtrar por estado.

## Estructura

```
src/
  main.jsx                 Punto de entrada
  App.jsx                  Estado global y lógica (componente padre)
  hooks/useLocalStorage.js Hook personalizado para persistir datos
  components/              Clientes, Vehiculos, Servicios, Ordenes
  styles.css               Estilos
```
