import { Circle, Path, Rect, Svg } from 'react-native-svg';

import { iconos, type NombreIcono } from '@/diseno/iconos';

type PropsIcono = {
  nombre: NombreIcono;
  /** Lado del cuadrado que ocupa el icono. Los mockups usan entre 15 y 30. */
  tamano?: number;
  color?: string;
  /**
   * Grosor de linea. El valor base del diseno es 1.9 y sube a 2.2 o 2.6 en los
   * iconos que acompanan acciones principales.
   */
  grosor?: number;
};

/**
 * Dibuja uno de los iconos del catalogo. Siempre son lineas sobre un lienzo de
 * 24 x 24, asi que un solo componente sirve para los cincuenta y tantos.
 */
export function Icono({ nombre, tamano = 22, color = 'currentColor', grosor = 1.9 }: PropsIcono) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      {iconos[nombre].map((trazo, posicion) => {
        const comunes = {
          stroke: color,
          strokeWidth: grosor,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        };
        if (trazo.figura === 'linea') {
          return <Path key={posicion} d={trazo.d} {...comunes} />;
        }
        if (trazo.figura === 'circulo') {
          return <Circle key={posicion} cx={trazo.cx} cy={trazo.cy} r={trazo.r} {...comunes} />;
        }
        return (
          <Rect
            key={posicion}
            x={trazo.x}
            y={trazo.y}
            width={trazo.ancho}
            height={trazo.alto}
            rx={trazo.radio}
            {...comunes}
          />
        );
      })}
    </Svg>
  );
}
