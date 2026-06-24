# Runnaract 2.0 — powered by Zitara

Evento de running organizado en Zitara Golf Club.

---

## Evento

- **Fecha:** 06/09/2026
- **Fecha límite de inscripción:** 04/09/2026
- **Capacidad máxima:** 2000 corredores
- Las inscripciones se cierran automáticamente al llegar a 2000 participantes o al 04/09/2026.

## Distancias y precios

### Primera fase (hasta el 10 de julio)
| Distancia | Precio |
|-----------|--------|
| 3 km | $300 |
| 5 km | $400 |
| 10 km | $450 |

### Segunda fase
| Distancia | Precio |
|-----------|--------|
| 3 km | $350 |
| 5 km | $450 |
| 10 km | $500 |

El sistema debe detectar automáticamente la fase según la fecha actual.

---

## Landing page

Estética editorial deportiva premium inspirada en Nike, Wolverine Worldwide y Follow Art. Minimalista, con grandes fotografías, espacios amplios, alto contraste y animaciones suaves.

### Secciones
- Hero principal con imagen o video
- Countdown dinámico (días, horas, minutos, segundos hasta el evento)
- Distancias y precios
- Mapa interactivo de la ruta
- Galería de fotografías (~50 fotos propias + stock temporal)
- Patrocinadores
- Preguntas frecuentes
- Botón de inscripción
- Información del evento
- Cronograma
- CTA final

---

## Diseño

### Colores
| Token | Color |
|-------|-------|
| `run-orange` | `#E85C28` |
| `run-blue` | `#1A2B56` |
| `run-gray` | `#F2F2F2` |
| beige claro | — |

### Tipografía
- **Headers:** Comfortaa
- **Body:** Rubik

### Componentes
- Tarjetas `rounded-2xl`
- Estética editorial deportiva, minimalista y asimétrica

### Inspiraciones
- Webflow
- Wolverine Worldwide
- Follow Art

---

## Registro

### Campos obligatorios
- Nombre
- Apellido
- Correo electrónico (único — no pueden existir dos participantes con el mismo correo)
- Mes de nacimiento
- Año de nacimiento
- Género
- Distancia
- Términos y condiciones
- Aviso de privacidad

### Campos opcionales
- Teléfono
- Contacto de emergencia

### Género
- Masculino
- Femenino
- Prefiero no decir

### Categorías
- Varonil
- Femenil

### Distancias
- 3 km
- 5 km
- 10 km

### Restricciones de edad
- La edad se calcula con respecto al día del evento.
- Menores de 18 años cumplidos al día del evento no pueden participar en la dinámica completa.
- El staff puede verificar la edad mediante identificación oficial.
- Los menores pueden participar únicamente mediante carta responsiva.

---

## Pagos

### Métodos de pago
- Mercado Pago — tarjeta
- Mercado Pago — SPEI
- Transferencia bancaria (requiere subir comprobante)

### Validación
- Las transferencias bancarias son validadas manualmente.
- El registro es válido únicamente después de que el pago sea aprobado.

### Estados del pago
- Pendiente
- En revisión
- Aprobado
- Rechazado

---

## Folio

- Se genera únicamente después de aprobarse el pago.
- Formato: `RUNN26-0001`, `RUNN26-0002`, `RUNN26-0003`...
- Idea futura: generar QR asociado al folio.

---

## Consulta de inscripción

El participante puede consultar mediante:
- Correo electrónico
- Folio

Muestra:
- Nombre completo
- Distancia inscrita
- Estado del pago
- Folio
- Correo de contacto para dudas

No hay cuentas ni inicio de sesión. Todo es público mediante consulta.

---

## Correos

- Solo se envía correo cuando el pago es aprobado.
- El correo incluye:
  - Confirmación de inscripción
  - Folio asignado
  - Información básica del evento

---

## Patrocinadores

Cada patrocinador tiene:
- Logo
- Descripción corta
- Sitio web o redes sociales
- Nivel de patrocinio (opcional)

Se muestran antes, durante y después del evento.

---

## Administración

Panel privado con las siguientes funciones:
- Ver participantes
- Buscar por nombre
- Buscar por correo
- Buscar por folio
- Ver pagos pendientes
- Aprobar transferencias
- Rechazar transferencias
- Ver estadísticas básicas
- Ver lugares restantes hasta 2000 corredores

### Fuera de alcance
- No hay roles
- No hay módulo de check-in
- No hay resultados de carrera
- No hay autenticación para participantes
