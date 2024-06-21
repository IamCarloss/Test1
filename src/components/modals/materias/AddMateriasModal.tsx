import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

interface AddMateriasModalProps {
  setIsLoading: Function;
  refreshTable: Function;
}

export default function AddMateriasModal({
  setIsLoading,
  refreshTable,
}: AddMateriasModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [name, setName] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [shortName, setShortName] = useState<string>("");
  const [methodology, setMethodology] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [period, setPeriod] = useState<number>(0);
  const [scheduledHours, setScheduledHours] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [expertise, setExpertise] = useState<string>("");
  const [formula, setFormula] = useState<string>("");

  // -------- AGREGAR MATERIA -------- //
  const addSubject = async () => {
    // ------- VALIDACIONES ------- //
    // Validar que el campo de nombre no este vacio
    if (name.trim() == "") {
      toast({
        title: "Error al agregar la materia.",
        description: "El campo de nombre no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // Validar que el campo de clave no este vacio
    if (key.trim() == "") {
      toast({
        title: "Error al agregar la materia.",
        description: "El campo de clave no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }
    // Validar que el campo de clave no este vacio
    if (!period) {
      toast({
        title: "Error al agregar la materia.",
        description: "El campo de periodo no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // Validar que el campo de horas programadas no este vacio
    if (scheduledHours == 0) {
      toast({
        title: "Error al agregar la materia.",
        description: "El campo de horas programadas no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // Validar que el campo de nombre no tenga mas de 50 caracteres
    if (name.length > 50) {
      toast({
        title: "Error al agregar la materia.",
        description: "El campo de nombre no puede tener mas de 50 caracteres.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // ------- AGREGAR A DB ------- //
    setIsLoading(true);
    try {
      // - Fetch POST - //
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          key,
          shortName,
          methodology,
          description,
          period,
          scheduledHours,
          credits,
          expertise,
          formula,
        }),
      });

      if (res.status === 200) {
        // - Mensaje de exito - //
        toast({
          title: "Materia agregada.",
          description: `La materia ${name} ha sido agregada exitosamente.`,
          variant: "left-accent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setName("");
        setKey("");
        setShortName("");
        setMethodology("");
        setDescription("");
        setPeriod(0);
        setScheduledHours(0);
        setCredits(0);
        setExpertise("");
        setFormula("");

        refreshTable();
      } else if (res.status == 400) {
        // - Mensaje de error - //
        toast({
          title: "Error al agregar la materia.",
          description: "Ya existe una materia registrada con la mismo nombre.",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (res.status == 401) {
        //--Mensaje de error al agregar la clave--//
        toast({
          title: "Error al agregar la materia.",
          description: "Ya existe una materia registrada con la misma clave.",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // - Mensaje de error - //
        toast({
          title: "Error al agregar la materia.",
          description: "Ha ocurrido un error al agregar la materia.",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      // - Mensaje de error - //
      toast({
        title: "Error.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      <Button colorScheme="green" gap={3} onClick={onOpen} variant={"outline"}>
        <FaBookOpen />
        Registrar materia
      </Button>

      {/* // -------- MODAL -------- // */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"2xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Crea una materia</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            <Grid templateColumns={"repeat(2, 1fr)"} gap={2}>
              {/* // - INPUT NOMBRE DE LA MATERIA - // */}
              <GridItem colSpan={2}>
                <FormControl isRequired>
                  <FormLabel>Nombre:</FormLabel>
                  <Input
                    placeholder="Nombre de la materia"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
              </GridItem>
              {/* // - INPUT CLAVE DE LA MATERIA - // */}
              <GridItem>
                <FormControl isRequired mt={4}>
                  <FormLabel>Clave:</FormLabel>

                  <Input
                    placeholder="Clave de la materia"
                    maxLength={10}
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                  />
                </FormControl>
              </GridItem>
              {/* // - INPUT NOMBRE CORTO DE LA MATERIA - // */}
              <GridItem>
                <FormControl mt={4}>
                  <FormLabel>Nombre corto:</FormLabel>

                  <Input
                    placeholder="Nombre corto de la materia"
                    maxLength={5}
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                  />
                </FormControl>
              </GridItem>
              {/* // - METODOLOGIA DE LA MATERIA - // */}
              <GridItem>
                <FormControl mt={4}>
                  <FormLabel>Metodología:</FormLabel>

                  <Input
                    placeholder="Metodología de la materia"
                    maxLength={50}
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                  />
                </FormControl>
              </GridItem>
              {/* // - PERIODO DE LA MATERIA - // */}
              <GridItem>
                <FormControl isRequired mt={4}>
                  <FormLabel>Periodo:</FormLabel>

                  <Select
                    placeholder="Selecciona un periodo..."
                    value={period}
                    onChange={(e) => setPeriod(parseInt(e.target.value))}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </Select>
                </FormControl>
              </GridItem>
              {/* // - DESCRIPCION DE LA MATERIA - // */}
              <GridItem colSpan={2}>
                <FormControl mt={4}>
                  <FormLabel>Descripcion:</FormLabel>

                  <Textarea
                    placeholder="Descripción de la materia"
                    value={description}
                    resize={"none"}
                    maxLength={150}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
              </GridItem>
              {/* // - HORAS PROGRAMADAS - // */}
              <GridItem>
                <FormControl isRequired mt={4}>
                  <FormLabel>Horas programadas:</FormLabel>
                  <Input
                    type="text"
                    placeholder="Horas programadas de la materia"
                    maxLength={2}
                    as={NumericFormat}
                    allowNegative={false}
                    decimalScale={0}
                    value={scheduledHours}
                    onChange={(e) =>
                      setScheduledHours(parseInt(e.target.value))
                    }
                    onFocus={handleFocus}
                  />
                </FormControl>
              </GridItem>
              {/* // - CRÉDITOS - // */}
              <GridItem>
                <FormControl mt={4}>
                  <FormLabel>Creditos:</FormLabel>
                  <Input
                    type="text"
                    placeholder="Creditos de la materia"
                    maxLength={4}
                    as={NumericFormat}
                    allowNegative={false}
                    decimalScale={1}
                    value={credits}
                    onChange={(e) => setCredits(parseInt(e.target.value))}
                    onFocus={handleFocus}
                  />
                </FormControl>
              </GridItem>
              {/* // - ÁREA DE CONOCIMIENTO - // */}
              <GridItem>
                <FormControl mt={4}>
                  <FormLabel>Área de conocimiento:</FormLabel>
                  <Input
                    placeholder="Área de conocimiento"
                    maxLength={50}
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                  />
                </FormControl>
              </GridItem>
              {/* // -  FORMULA - // */}
              <GridItem>
                <FormControl mt={4}>
                  <FormLabel>Fórmula:</FormLabel>
                  <Input
                    placeholder="Fórmula"
                    maxLength={50}
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            <Button colorScheme="green" onClick={addSubject}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
