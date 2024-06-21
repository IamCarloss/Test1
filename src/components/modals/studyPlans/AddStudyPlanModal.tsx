import { academicLevelConverter } from "@/utils/academicLevelConverter";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  ListItem,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface IAddStudyPlanModalProps {
  career: ICareer;
  setIsLoading: Function;
  getStudyPlans: Function;
}

export default function AddStudyPlanModal({
  career,
  setIsLoading,
  getStudyPlans,
}: IAddStudyPlanModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [period, setPeriod] = useState<string>("semester");

  const handleCreateStudyPlan = async () => {
    // - VALIDACION DE PARAMETROS - //
    if (name.trim() == "" || code.trim() == "") {
      toast({
        title: "Error al crear plan de estudio",
        description: "Todos los campos son requeridos",
        variant: "left-accent",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // - PETICION POST - //
      const res = await fetch("/api/studyPlans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          careerId: career._id,
          name: name.trim(),
          code: code.trim(),
          period: period,
        }),
      });

      const data = await res.json();

      if (res.status == 200) {
        toast({
          title: "Plan de estudio creado",
          description: "El plan de estudio fue creado exitosamente",
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // - CERRAR MODAL - //
        getStudyPlans();
        setName("");
        setCode("");
        onClose();
      } else if (res.status == 400) {
        toast({
          title: "Error al crear plan de estudio",
          description: data.message,
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error al crear plan de estudio",
          description: "Hubo un error al intentar crear el plan de estudio",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al crear plan de estudio",
        description: "Hubo un error al intentar crear el plan de estudio",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      <MenuItem
        icon={<FaPlus />}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Crear Plan de Estudios
      </MenuItem>

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Crear Plan de Estudio</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody py={4}>
            {/* // -------- INFORMACION DE LA CARRERA -------- // */}
            <Text>Este plan de estudio estara asignado a la carrera:</Text>

            <UnorderedList mt={2}>
              <ListItem fontWeight={"bold"}>
                {convertToTitleCase(career.name)}
              </ListItem>

              <ListItem fontWeight={"bold"}>
                <Box as="em" color={"green.600"}>
                  {academicLevelConverter(career.academicLevel)}
                </Box>
              </ListItem>
            </UnorderedList>

            <Box mt={4} mx={4}>
              <Divider borderColor={"green.400"} />
            </Box>

            {/* // -------- FORMULARIO DE PLAN DE ESTUDIO -------- // */}
            {/* // - NOMBRE DEL PLAN DE ESTUDIO - // */}
            <FormControl mt={4} isRequired>
              <FormLabel>Nombre:</FormLabel>
              <Input
                placeholder="Nombre del plan de estudio"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            {/* // - CODIGO DEL PLAN DE ESTUDIO - // */}
            <FormControl mt={4} isRequired>
              <FormLabel>Codigo:</FormLabel>
              <Input
                placeholder="Codigo del plan de estudio"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </FormControl>

            {/* // - CODIGO DEL PLAN DE ESTUDIO - // */}
            <FormControl mt={4} isRequired>
              <FormLabel>Denominacion de Periodo:</FormLabel>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="semester">Semestre</option>
                <option value="anual">Anual</option>
                <option value="quarter">Cuatrimestre</option>
              </Select>
            </FormControl>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            <Button colorScheme="green" onClick={handleCreateStudyPlan}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
