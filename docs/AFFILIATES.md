# AItoolSpott — Afiliados (cómo activar la monetización)

El código ya está listo: pones tu link de afiliado en `public/affiliates.json` y el
sitio lo usa automáticamente (con `rel="sponsored"`). No hay que tocar más código.

## Cómo se activa (por herramienta)
1. Te unes al programa de afiliados de la herramienta (abajo).
2. Copias tu link de afiliado único.
3. Lo pegas en `public/affiliates.json` en la clave con el nombre EXACTO de la
   herramienta (debe coincidir con `ai-tools-data.json`), ej:
   ```json
   "Jasper": "https://jasper.ai?fpr=tuID"
   ```
4. Redeploy. Listo — cada vez que alguien elija esa herramienta en el finder, va por tu link.

## Programas que más pagan (prioriza estos)
| Herramienta | Red / cómo unirte | Pago típico |
|---|---|---|
| **Jasper** | PartnerStack | 25-30% recurrente |
| **Writesonic** | Directo (writesonic.com/affiliate) | 30% recurrente |
| **Frase** | Directo | 30% recurrente |
| **Surfer SEO** | PartnerStack | 25% recurrente |
| **Synthesia** | Directo | ~$100+ por venta |
| **Descript** | PartnerStack | recurrente |
| **Pictory** | Directo | 20-50% recurrente |
| **ElevenLabs** | Directo | 22% recurrente |
| **Semrush** | Impact (BeRush) | $200 por venta + $10 por trial |
| **Notion / Grammarly / Canva** | Directo | variable |

**Recomendación:** empieza con **PartnerStack** (una sola cuenta te da varios:
Jasper, Surfer, Descript…) + **Writesonic** y **Frase** (directos, rápidos).

## Nota importante
- Los afiliados solo generan con **tráfico**. Hoy hay poco → el retorno llega cuando
  el SEO madure. Pero dejar esto listo cuesta $0 y captura el valor desde el primer clic.
- Ya hay **divulgación de afiliado** en el footer (requisito legal). No la quites.
