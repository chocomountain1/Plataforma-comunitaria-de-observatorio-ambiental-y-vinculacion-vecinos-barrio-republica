import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { familias } from '@/diseno/tipografia';
import { usarPreferencias } from '@/estado/preferencias';

type PropsCampoTexto = {
  valor: string;
  onCambiar: (valor: string) => void;
  etiqueta?: string;
  /** Texto de apoyo bajo el campo, por ejemplo el limite de caracteres. */
  ayuda?: string;
  marcaDeAgua?: string;
  /** Un campo de varias lineas crece segun las filas pedidas. */
  lineas?: number;
  maximoDeCaracteres?: number;
  tipoDeTeclado?: 'texto' | 'correo';
  autoenfocar?: boolean;
};

/**
 * Campo de escritura del formulario. Marca el borde en verde mientras se
 * escribe, igual que los mockups, para que se vea donde esta puesto el foco.
 */
export function CampoTexto({
  valor,
  onCambiar,
  etiqueta,
  ayuda,
  marcaDeAgua,
  lineas = 1,
  maximoDeCaracteres,
  tipoDeTeclado = 'texto',
  autoenfocar = false,
}: PropsCampoTexto) {
  const { factorTexto } = usarPreferencias();
  const [enfocado, setEnfocado] = useState(false);
  const esDeVariasLineas = lineas > 1;
  const resaltado = enfocado || valor.length > 0;

  return (
    <View style={{ gap: espacio.corto }}>
      {etiqueta === undefined ? null : (
        <Texto tamano={15} peso="fuerte">
          {etiqueta}
        </Texto>
      )}
      <TextInput
        value={valor}
        onChangeText={onCambiar}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        placeholder={marcaDeAgua}
        placeholderTextColor={colores.grisTexto}
        multiline={esDeVariasLineas}
        maxLength={maximoDeCaracteres}
        autoFocus={autoenfocar}
        allowFontScaling={false}
        keyboardType={tipoDeTeclado === 'correo' ? 'email-address' : 'default'}
        autoCapitalize={tipoDeTeclado === 'correo' ? 'none' : 'sentences'}
        accessibilityLabel={etiqueta ?? marcaDeAgua}
        style={{
          borderRadius: radio.boton,
          borderWidth: resaltado ? 2 : 1.5,
          borderColor: resaltado ? colores.verde : colores.bordeFuerte,
          backgroundColor: colores.papel,
          fontFamily: familias.texto,
          fontSize: 16.5 * factorTexto,
          color: colores.tinta,
          paddingHorizontal: espacio.amplio - 2,
          ...(esDeVariasLineas
            ? {
                paddingTop: espacio.medio,
                paddingBottom: espacio.medio,
                minHeight: 26 * lineas * factorTexto + espacio.bloque,
                textAlignVertical: 'top' as const,
              }
            : { height: alturaTocable.principal * Math.max(1, factorTexto * 0.95) }),
        }}
      />
      {ayuda === undefined ? null : (
        <Texto tamano={13} color={colores.grisTexto}>
          {ayuda}
        </Texto>
      )}
    </View>
  );
}
