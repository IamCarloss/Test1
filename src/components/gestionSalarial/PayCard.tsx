import { IClasificacion } from "@/models/interfaces/clasificacionInterface";
import formatoNumerico from "@/utils/formatoNumerico/Numerico";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Td,
  Text,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { NumericFormat } from "react-number-format";
import { ModalDelete } from "../modals/gestion-salarial/modalDelete";

interface PayCardProps {
  clasificacion: string;
  clickDelete?: () => void;
  clickEdit?: () => void;
}

const PayCard: React.FC<PayCardProps> = ({
  clasificacion,
  clickDelete = () => {},
  clickEdit = () => {},
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [classificationData, setClassificationData] =
    useState<IClasificacion | null>(null);
  const [DatosInputs, SETDatosInputs] = useState({
    primaria: 0,
    secundaria: 0,
    bachillerato: 0,
    universidad: 0,
    posgrado: 0,
    nocturna: 0,
    virtual: 0,
    taller: 0,
  });

  // -------- COLORES DE CLASIFICACION -------- //
  const classificationColors: any = {
    a: "#39A168",
    b: "#D69E2E",
    c: "#DD6B20",
    d: "#3082CF",
    i: "#708097",
  };
  const [isLoading, setIsLoading] = useState(false);

  const getClassificationData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/gestion-salarial?clasificacion=${clasificacion}`
      );
      const data = await res.json();

      if (res.status != 200) {
        console.error("Error al enviar la solicitud:", res.statusText);
        setIsLoading(false);
      }

      setClassificationData(data.pay[0]);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    SETDatosInputs((prevDato) => ({
      ...prevDato,
      [name]: value,
    }));
  };

  const LimpiarInputs = () => {
    SETDatosInputs({
      primaria: 0,
      secundaria: 0,
      bachillerato: 0,
      universidad: 0,
      posgrado: 0,
      nocturna: 0,
      virtual: 0,
      taller: 0,
    });
  };

  const handleEnvio = async (e: FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos obligatorios estén llenos
    const {
      primaria,
      secundaria,
      bachillerato,
      universidad,
      posgrado,
      nocturna,
      virtual,
      taller,
      ...restOfDatosInputs
    } = DatosInputs;

    const camposObligatoriosLlenos = Object.values(restOfDatosInputs).every(
      (value) => {
        return value !== "" && value !== null && value !== undefined;
      }
    );

    if (!camposObligatoriosLlenos) {
      toast({
        title: "Error",
        description: "Debes llenar todos los campos.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const camposNumerosNoCero = Object.values(DatosInputs).every((value) => {
      if (typeof value === "number") {
        return value !== 0;
      }
      return true;
    });

    if (!camposNumerosNoCero) {
      toast({
        title: "Error",
        description: "Ningun campo puede ser cero.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (classificationData) {
      ActualizarPagoHora(classificationData._id);
    } else {
      CrearPagoHora();
    }
  };

  // ---------- PETICION POST  ---------- //
  const CrearPagoHora = async () => {
    try {
      const res = await fetch("/api/gestion-salarial/", {
        method: "POST",
        body: JSON.stringify({
          clasificacion: clasificacion,
          datos: DatosInputs,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status != 200) {
        console.error("Error al enviar la solicitud:", res.statusText);

        return;
      }

      getClassificationData();

      toast({
        title: "Pago por hora due creado correctamente",
        description: "El pago .",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast({
        title: "Error",
        description: "El pago por hora no fue creado.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const ActualizarPagoHora = async (id: string) => {
    try {
      const res = await fetch("/api/gestion-salarial/", {
        method: "PUT",
        body: JSON.stringify({ datos: DatosInputs, _id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status != 200) {
        console.error("Error al enviar la solicitud:", res.statusText);
        return;
      }

      getClassificationData();

      toast({
        title: "Actualización exitosa.",
        description: "El pago por hora ha sido actualizado correctamente.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error.",
        description: "El pago por hora no fue actualizado.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // ---------- PRECARGADOR ---------- //
  const precargarClasificacion = () => {
    if (classificationData) {
      SETDatosInputs({
        ...DatosInputs,
        primaria: classificationData.primaria,
        secundaria: classificationData.secundaria,
        bachillerato: classificationData.bachillerato,
        universidad: classificationData.universidad,
        posgrado: classificationData.posgrado,
        nocturna: classificationData.nocturna,
        virtual: classificationData.virtual,
        taller: classificationData.taller,
      });
    }
  };

  useEffect(() => {
    precargarClasificacion();
  }, [classificationData]);

  useEffect(() => {
    getClassificationData();
  }, []);
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
    console.log(event.target);
  };
  return (
    <Box
      transition={"all 0.3s ease-in-out"}
      _hover={{
        transform: "scale(1.01)",
        boxShadow: "2xl",
      }}
      position={"relative"}
      h={"100%"}
      w={"18%"}
    >
      <Flex
        border={"1px solid #e2ree8f0"}
        h={"100%"}
        w={"100%"}
        direction={"column"}
        boxShadow={"lg"}
        borderRadius={10}
        overflow={"hidden"}
      >
        <Box w={"100%"} h={"90%"}>
          <Flex w={"100%"} h={"100%"} align={"center"}>
            {classificationData && classificationData.primaria > 0 && (
              <TableContainer overflowX={"hidden"} w={"95%"} h={"85%"}>
                <Table
                  colorScheme="green.200"
                  size={"md"}
                  fontWeight={"bold"}
                  fontSize={"xs"}
                >
                  <Tr>
                    <Td>Primaria:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.primaria)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Secundaria:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.secundaria)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Bachillerato:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.bachillerato)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Universidad M/V:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.universidad)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Posgrado:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.posgrado)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Universidad Noc:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.nocturna)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Universidad Vir:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.virtual)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Taller:</Td>
                    <Td isNumeric>
                      {formatoNumerico(classificationData.taller)}
                    </Td>
                  </Tr>
                </Table>
              </TableContainer>
            )}

            {(!classificationData || classificationData.primaria == 0) && (
              <>
                <br />

                <Box textAlign="center" color="gray.300">
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IoWarning size={100} />

                    <Text mt={2} fontSize="lg" px={4}>
                      Clasificacion sin configurar
                    </Text>
                  </Flex>
                </Box>
              </>
            )}
          </Flex>
        </Box>

        <Flex w={"100%"} h={"10%"}>
          <Box h={"100%"} w={"100%"}>
            <IconButton
              isLoading={isLoading}
              borderRadius={0}
              h={"100%"}
              w={"100%"}
              variant={"ghost"}
              colorScheme={"blue"}
              aria-label="Search database"
              icon={<FaEdit size={30} onClick={clickEdit} />}
              onClick={onOpen}
            />
          </Box>
          <Box
            h={classificationData?.primaria === 0 ? "0%" : "100%"}
            w={classificationData?.primaria === 0 ? "0%" : "100%"}
          >
            <ModalDelete
              clasificacionData={classificationData}
              refresh={getClassificationData}
              isLoading={isLoading}
            />
          </Box>
        </Flex>
      </Flex>

      <Box
        h={"50px"}
        w={"50px"}
        bg={classificationColors[clasificacion]}
        position={"absolute"}
        top={"-5px"}
        left={"-5px"}
        borderRadius={4}
        justifyContent={"center"}
        display={"flex"}
        alignItems={"center"}
        fontWeight={"bold"}
        color={"white"}
        fontSize={"2xl"}
        boxShadow={"xl"}
      >
        {clasificacion ? clasificacion.toLocaleUpperCase() : "error"}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        size="4xl"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>
            Clasificacion: {clasificacion.toLocaleUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            <Grid templateColumns={"repeat(2, 1fr)"} gap={10}>
              <GridItem colSpan={1}>
                {/* Primaria */}
                <label className=" mb-3.5">
                  <b>Primaria:</b>
                  <Input
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        primaria: floatValue,
                      }));
                    }}
                    id="primaria"
                    name="primaria"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl   px-3 py-2"
                    value={DatosInputs.primaria}
                  />
                </label>
                {/* Secundaria */}
                <label className=" mb-3.5">
                  <b>Secundaria:</b>
                  <Input
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        secundaria: floatValue,
                      }));
                    }}
                    id="secundaria"
                    name="secundaria"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl px-1 py-22 focus:outline-none focus:border-green-700"
                    value={DatosInputs.secundaria}
                  />
                </label>
                {/* Bachillerato */}
                <label className=" mb-3.5">
                  <b>Bachillerato:</b>
                  <Input
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        bachillerato: floatValue,
                      }));
                    }}
                    id="bachillerato"
                    name="bachillerato"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl px-1 py-22 focus:outline-none focus:border-green-700"
                    value={DatosInputs.bachillerato}
                  />
                </label>
                <label className=" mb-3.5">
                  <b>Universidad Matutino/Vespertino:</b>
                  <Input
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        universidad: floatValue,
                      }));
                    }}
                    id="universidad"
                    name="universidad"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl px-1 py-22 focus:outline-none focus:border-green-700"
                    value={DatosInputs.universidad}
                  />
                </label>
              </GridItem>
              <GridItem colSpan={1}>
                {/* Posgrado */}
                <label className=" mb-3.5">
                  <b>Posgrado:</b>
                  <Input
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        posgrado: floatValue,
                      }));
                    }}
                    id="posgrado"
                    name="posgrado"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl px-1 py-22 focus:outline-none focus:border-green-700"
                    value={DatosInputs.posgrado}
                  />
                </label>
                {/* Universidad Nocturna */}
                <label className=" mb-3.5">
                  <b>Universidad Nocturna:</b>
                  <Input
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        nocturna: floatValue,
                      }));
                    }}
                    id="nocturna"
                    name="nocturna"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl px-1 py-22 focus:outline-none focus:border-green-700"
                    value={DatosInputs.nocturna}
                  />
                </label>
                {/* Universidad virtual */}
                <label className=" mb-3.5">
                  <b> Universidad virtual:</b>
                  <Input
                    maxLength={10}
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        virtual: floatValue,
                      }));
                    }}
                    id="virtual"
                    name="virtual"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl px-1 py-22 focus:outline-none focus:border-green-700"
                    value={DatosInputs.virtual}
                  />
                </label>
                {/* Taller */}
                <label className=" mb-3.5">
                  <b>Taller:</b>
                  <Input
                    as={NumericFormat}
                    allowNegative={false}
                    prefix="$"
                    thousandSeparator={true}
                    fixedDecimalScale
                    decimalScale={2}
                    onFocus={handleFocus}
                    isAllowed={(values: any) => {
                      const { floatValue } = values;
                      const integerPart = Math.floor(floatValue);
                      return integerPart.toString().length <= 4;
                    }}
                    onValueChange={(values: any) => {
                      const { floatValue } = values;
                      console.log(values);
                      SETDatosInputs((prevDato) => ({
                        ...prevDato,
                        taller: floatValue,
                      }));
                    }}
                    id="taller"
                    name="taller"
                    type="text"
                    placeholder="Introduzca salario/hora"
                    className="ml-2 border border-green-600 rounded-2xl px-1 py-22 focus:outline-none focus:border-green-700"
                    value={DatosInputs.taller}
                  />
                </label>
              </GridItem>
            </Grid>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button
              variant={"ghost"}
              mr={3}
              onClick={() => {
                LimpiarInputs();
                onClose();
              }}
            >
              Cerrar
            </Button>

            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
              onClick={handleEnvio}
            >
              Agregar
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PayCard;
