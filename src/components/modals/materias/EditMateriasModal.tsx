import { ISubject } from "@/models/interfaces/subjectInterface";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  MenuItem,
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
import { FaEdit } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

interface EditMateriasModalProps {
  subject: ISubject;
  setIsLoading: Function;
  refreshTable: Function;
}

export default function EditMateriasModal({
  subject,
  setIsLoading,
  refreshTable,
}: EditMateriasModalProps) {
  //--HOOKS--//
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //--USESTATE--//
  const [name, setName] = useState<string>(convertToTitleCase(subject.name));
  const [key, setKey] = useState<string>(subject.key);
  const [shortName, setShortname] = useState<string>(subject.shortName || "");
  const [methodology, setMethodology] = useState<string>(
    subject.methodology || ""
  );
  const [description, setDescription] = useState<string>(
    subject.description || ""
  );
  const [period, setPeriod] = useState<number>(subject.period);
  const [scheduledHours, setScheduledHours] = useState<number>(
    subject.scheduledHours
  );
  const [credits, setCredits] = useState<number>(subject.credits || 0); // Provide a default value for credits
  const [expertise, setExpertise] = useState<string>(subject.expertise || "");
  const [formula, setFormula] = useState<string>(subject.formula || "");

  //--EDITAR MATERIA--//
  const handleEditSubject = async () => {
    if (name.trim() === "") {
      toast({
        title: "Error al editar materia.",
        description: "El campo de nombre no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (key.trim() === "") {
      toast({
        title: "Error al editar materia.",
        description: "El campo de clave no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!period) {
      toast({
        title: "Error al editar materia.",
        description: "El campo de periodo no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (scheduledHours == 0 || !scheduledHours) {
      toast({
        title: "Error al editar materia.",
        description: "El campo de horas programadas no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/subjects`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject_id: subject._id,
          name: name || "",
          key: key || "",
          shortName: shortName || "",
          methodology: methodology || "",
          description: description || "",
          period: period || null,
          scheduledHours: scheduledHours || null,
          credits: credits || null,
          expertise: expertise || "",
          formula: formula || "",
        }),
      });

      if (res.status === 200) {
        toast({
          title: "Materia editada.",
          description: "La materia ha sido editada exitosamente.",
          variant: "left-accent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refreshTable();
        onClose();
      } else {
        toast({
          title: "Error al editar materia.",
          description: "Ocurrió un error al editar la materia.",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
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
      {/* //--BOTON PARA ABRIR MODAL--// */}

      <MenuItem
        icon={<FaEdit></FaEdit>}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Editar docente
      </MenuItem>

      {/* //--MODAL--// */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"2xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(2px)"></ModalOverlay>
        <ModalContent>
          {/* //--MODAL HEADER --*/}
          <ModalHeader fontWeight={"bold"}>Editar docente</ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <Divider></Divider>

          {/* //--MODAL BODY --*/}
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
                    onChange={(e) => setShortname(e.target.value)}
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

            <Button colorScheme="green" onClick={handleEditSubject}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
