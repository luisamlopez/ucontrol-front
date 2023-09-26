import {
  Box,
  Container,
  Typography,
  Link,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Sidebar } from "../components/Sidebar";

const HelpPage = (): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Container sx={{ m: 0, p: 0 }}>
        <Box
          display={"flex"}
          flexDirection="column"
          sx={{
            p: 2,
          }}
        >
          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 24, sm: 48, lg: 48 }}
            fontWeight={600}
            p={0}
            mt={{ xs: 6, sm: 0, lg: 0 }}
            mb={2}
            sx={{
              wordWrap: "break-word",
            }}
          >
            Centro de ayuda
          </Typography>

          <Accordion>
            <AccordionSummary
              expandIcon="+"
              aria-controls="panel1a-content"
              sx={{
                color: "#000000",
                fontWeight: 600,
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                Tabla de Contenido
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                <li>
                  <Link
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    href="#section-1"
                  >
                    1. Introducción
                  </Link>
                  <ul>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-1-1"
                      >
                        1.1. Propósito del Manual
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    href="#section-2"
                  >
                    2. Requisitos Previos
                  </Link>
                  <ul>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-2-1"
                      >
                        2.1. Hardware Requerido
                      </Link>
                    </li>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-2-2"
                      >
                        2.2. Software Requerido
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    href="#section-3"
                  >
                    3. Configuración de Dispositivos IoT
                  </Link>
                  <ul>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-3-1"
                      >
                        3.1. Configuración de Sensores y Dispositivos
                      </Link>
                      <ul>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-3-1-1"
                          >
                            3.1.1. Sensores de Temperatura y Humedad
                          </Link>
                        </li>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-3-1-2"
                          >
                            3.1.2. Sensor de Movimiento PIR
                          </Link>
                        </li>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-3-1-3"
                          >
                            3.1.3. Otros Sensores
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-3-2"
                      >
                        3.2. Configuración de Actuadores
                      </Link>
                      <ul>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-3-2-1"
                          >
                            3.2.1. Control de Luminarias y Aire Acondicionado
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    href="#section-4"
                  >
                    4. Uso de la Aplicación UControl
                  </Link>
                  <ul>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-4-1"
                      >
                        4.1. Inicio de Sesión
                      </Link>
                    </li>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-4-2"
                      >
                        4.2. Inicio de Sesión
                      </Link>
                    </li>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-4-3"
                      >
                        4.2. Dashboard
                      </Link>
                      <ul>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-4-3-1"
                          >
                            4.3.1. Resumen de Dispositivos
                          </Link>
                        </li>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-4-3-2"
                          >
                            4.3.2. Monitoreo en Tiempo Real
                          </Link>
                        </li>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-4-3-3"
                          >
                            4.3.3. Control de Dispositivos
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-4-4"
                      >
                        4.4. Configuración de Dispositivos
                      </Link>
                      <ul>
                        <li>
                          <Link
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            href="#section-4-4-1"
                          >
                            4.4.1. Agregar Nuevo Dispositivo
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        sx={{
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        href="#section-4-5"
                      >
                        4.5. Notificaciones
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
          <Box>
            <h2 id="section-1">1. Introducción</h2>
            <h3 id="section-1-1">Propósito del Manual</h3>
            <p>
              Este manual tiene como objetivo proporcionar instrucciones
              detalladas para configurar, utilizar y mantener el sistema de
              monitoreo de instalaciones basado en inmótica en la UCAB Guayana.
            </p>
            <p>
              Este manual está diseñado para usuarios sin conocimientos previos
              en informática que deseen utilizar el sistema. Está dirigido a
              personal de la universidad responsable del monitoreo de
              instalaciones.
            </p>

            <h2 id="section-2">2. Requisitos Previos</h2>
            <h3 id="section-2-1">Hardware Requerido</h3>
            <ul>
              <li>Lista de dispositivos IoT y sensores necesarios.</li>
              <li>Microcontroladores compatibles.</li>
            </ul>

            <h3 id="section-2-2">Software Requerido</h3>
            <ul>
              <li>
                Arduino IDE (para cargar el código si es necesario en los
                microcontroladores).
              </li>
            </ul>

            <h2 id="section-3">3. Configuración de Dispositivos IoT</h2>
            <p>
              La configuración adecuada de sus dispositivos IoT es fundamental
              para garantizar que el sistema funcione de manera eficiente. En
              esta sección, aprenderá cómo configurar y conectar sus
              dispositivos a la aplicación UControl.
            </p>

            <h3 id="section-3-1">
              3.1. Configuración de Sensores y Dispositivos
            </h3>

            <h4 id="section-3-1-1">3.1.1. Sensores de Temperatura y Humedad</h4>
            <p>
              Para configurar los sensores de temperatura y humedad, siga estos
              pasos:
            </p>
            <ol>
              <li>
                <strong>Conexión física:</strong> Conecte el sensor de
                temperatura y humedad a la tarjeta ESP8266.
              </li>
              <li>
                <strong>Encendido:</strong> Alimente la tarjeta ESP8266.
                Asegúrese de que esté funcionando correctamente.
              </li>
              <li>
                <strong>Conexión a la red Wi-Fi:</strong> Asegúrese de que la
                tarjeta ESP8266 esté conectada a la misma red Wi-Fi correcta.
              </li>
              <li>
                <strong>Configuración en la Aplicación:</strong>
                <ul>
                  <li>Abra la aplicación UControl en su dispositivo móvil.</li>
                  <li>Vaya a la sección "Administrador de Dispositivos".</li>
                  <li>Seleccione "Agregar Nuevo Dispositivo".</li>
                  <li>Elija "Sensor de Temperatura y Humedad".</li>
                  <li>
                    Siga las instrucciones en pantalla para agregar el
                    dispositivo. Deberá ingresar detalles como el nombre del
                    dispositivo y la ubicación.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Prueba:</strong> Verifique que el sensor esté enviando
                datos correctamente en la sección de monitoreo de la aplicación
                en tópico mostrado en UControl.
              </li>
            </ol>

            <h4 id="section-3-1-2">3.1.2. Sensor de Movimiento PIR</h4>
            <p>
              La configuración del sensor de movimiento PIR es la siguiente:
            </p>
            <ol>
              <li>
                <strong>Montaje:</strong> Instale el sensor de movimiento PIR a
                una altura mínima de dos (2) metros desde el suelo para una
                detección efectiva.
              </li>
              <li>
                <strong>Conexión física:</strong> Conecte el sensor de
                movimiento PIR a la tarjeta ESP8266 o Arduino.
              </li>
              <li>
                <strong>Encendido:</strong> Alimente la tarjeta ESP8266 o
                Arduino. Asegúrese de que esté funcionando correctamente.
              </li>
              <li>
                <strong>Conexión a la red Wi-Fi:</strong> Asegúrese de que las
                tarjetas estén conectadas.
              </li>
              <li>
                <strong>Configuración en la Aplicación:</strong>
                <ul>
                  <li>
                    Abra la aplicación UControl en su dispositivo móvil o
                    computadora.
                  </li>
                  <li>Vaya a la sección "Administrador de Dispositivos".</li>
                  <li>Seleccione "Agregar Nuevo Dispositivo".</li>
                  <li>Elija "Sensor de Movimiento PIR".</li>
                  <li>
                    Siga las instrucciones en pantalla para agregar el
                    dispositivo. Deberá ingresar detalles como el nombre del
                    dispositivo y la ubicación.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Prueba:</strong> Verifique que el sensor esté enviando
                datos correctamente en la sección de monitoreo de la aplicación
                en tópico mostrado en UControl.
              </li>
            </ol>

            <h4 id="section-3-1-3">3.1.3. Otros Sensores</h4>
            <p>
              Si está utilizando otros tipos de sensores, siga los pasos de
              conexión física y configuración en la aplicación de manera similar
              a los sensores mencionados anteriormente. Asegúrese de seguir las
              instrucciones proporcionadas por el fabricante del sensor para su
              configuración específica.
            </p>

            <h3 id="section-3-2">3.2. Configuración de Actuadores</h3>

            <h4 id="section-3-2-1">
              3.2.1. Control de Luminarias y Aire Acondicionado
            </h4>
            <p>
              Para configurar dispositivos de control de luminarias y aire
              acondicionado, siga estos pasos:
            </p>
            <ol>
              <li>
                <strong>Conexión física:</strong> Conecte los dispositivos de
                control de luminarias y aire acondicionado en el relay conectado
                a la Arduino.
              </li>
              <li>
                <strong>Encendido:</strong> Alimente las tarjetas ESP8266 y
                Arduino. Asegúrese de que estén funcionando correctamente.
              </li>
              <li>
                <strong>Conexión a la red Wi-Fi:</strong> Asegúrese de que la
                tarjeta ESP8266 esté conectada a la misma red Wi-Fi correcta.
              </li>
              <li>
                <strong>Configuración en la Aplicación:</strong>
                <ul>
                  <li>Abra la aplicación UControl en su dispositivo móvil.</li>
                  <li>Vaya a la sección "Administrador de Dispositivos".</li>
                  <li>Seleccione "Agregar Nuevo Dispositivo".</li>
                  <li>
                    Elija el tipo de dispositivo de control que está
                    configurando (luminarias o aire acondicionado).
                  </li>
                  <li>
                    Siga las instrucciones en pantalla para agregar el
                    dispositivo. Deberá ingresar detalles como el nombre del
                    dispositivo y la ubicación.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Prueba:</strong> Verifique que los dispositivos de
                control respondan correctamente a las instrucciones enviadas
                desde la aplicación con el tópico mostrada en la misma.
              </li>
            </ol>
            <h2 id="section-4">4. Uso de la Aplicación UControl</h2>

            <p>
              La aplicación web UControl le permite monitorear y controlar sus
              dispositivos IoT de manera eficiente y desde cualquier dispositivo
              con un navegador web. En esta sección, aprenderá a utilizar las
              funciones principales de la aplicación.
            </p>

            <h3 id="section-4-1">4.1. Registro de Usuario</h3>

            <ol>
              <li>
                En la página de inicio de sesión, haga clic en "¿No ha generado
                su clave de acceso? Hágalo aquí".
              </li>
              <li>
                En la página de restablecimiento de contraseña, ingrese su
                correo UCAB en el campo correspondiente y haga clic en "Enviar
                código de verificación".
              </li>
              <li>
                Se enviará un código de verificación a su correo UCAB. Ingrese
                el código de verificación en el campo correspondiente en la
                página de restablecimiento de contraseña y haga clic en
                "Verificar código".
              </li>
              <li>
                En la página de creación de contraseña, ingrese su nueva
                contraseña en los campos "Nueva contraseña" y "Confirmar
                contraseña".
              </li>
            </ol>

            <p>
              Los mismos pasos aplican para recuperar la contraseña en la opción
              "Recupere su contraseña".
            </p>

            <h3 id="section-4-2">4.2. Inicio de Sesión</h3>

            <p>
              Antes de comenzar, asegúrese de haber creado una cuenta y haber
              iniciado sesión en UControl. Si aún no ha creado una cuenta,
              consulte la sección anterior para obtener instrucciones.
            </p>

            <ol>
              <li>
                En la página de inicio, haga clic en "Iniciar Sesión" en la
                esquina superior derecha.
              </li>
              <li>
                Ingrese su dirección de correo electrónico y contraseña
                asociados a su cuenta UControl.
              </li>
              <li>Haga clic en "Iniciar Sesión" para acceder a su cuenta.</li>
            </ol>

            <h3 id="section-4-3">4.3. Dashboard</h3>

            <p>
              Una vez que haya iniciado sesión, será redirigido al Dashboard,
              donde podrá ver y gestionar sus dispositivos IoT. Aquí se
              encuentra la información más importante de su sistema de
              monitoreo.
            </p>

            <h4 id="section-4-3-1">4.3.1. Resumen de Dispositivos</h4>

            <p>
              En la página principal de Dashboard, verá una lista de todos los
              dispositivos IoT configurados. Cada dispositivo estará
              representado por una tarjeta que muestra información clave como el
              nombre del dispositivo, la ubicación y el estado actual.
            </p>

            <h4 id="section-4-3-2">4.3.2. Monitoreo en Tiempo Real</h4>

            <p>
              Para obtener información detallada sobre un dispositivo
              específico, haga clic en la tarjeta del dispositivo en la lista.
              Esto lo llevará a la página de monitoreo en tiempo real para ese
              dispositivo. Aquí podrá ver datos actualizados en tiempo real,
              como lecturas de sensores o estados de actuadores.
            </p>

            <h4 id="section-4-3-3">4.3.3. Control de Dispositivos</h4>

            <p>
              En la página de monitoreo en tiempo real, si su dispositivo es un
              actuador o un dispositivo que se puede controlar, encontrará
              opciones para realizar acciones específicas, como encender o
              apagar una luminaria o un aire acondicionado, etc.
            </p>

            <h3 id="section-4-4">4.4. Configuración de Dispositivos</h3>

            <h4 id="section-4-4-1">4.4.1. Agregar Nuevo Dispositivo</h4>

            <p>
              Si desea agregar un nuevo dispositivo IoT a su sistema, siga estos
              pasos:
            </p>

            <ol>
              <li>
                En el menú, haga clic en "Administrador de Dispositivos" en la
                barra de navegación.
              </li>
              <li>
                En la página de configuración de dispositivos, haga clic en
                "Agregar Nuevo Dispositivo".
              </li>
              <li>
                Seleccione el tipo de dispositivo que desea agregar (por
                ejemplo, sensor de temperatura y humedad).
              </li>
              <li>
                Siga las instrucciones en pantalla para completar la
                configuración del nuevo dispositivo. Esto generalmente implicará
                proporcionar un nombre para el dispositivo y su ubicación.
              </li>
            </ol>

            <h3 id="section-4-5">4.5. Notificaciones</h3>

            <p>
              UControl ofrece la capacidad de recibir notificaciones a su correo
              electrónico cuando ocurren eventos importantes, como alarmas de
              sensores o activación de actuadores. Puede configurar estas
              notificaciones en la sección "Notificaciones" de la aplicación.
            </p>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HelpPage;
