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
import { FaEdit } from "react-icons/fa";

interface IEditStudyPlanModalProps {
  career: ICareer;
  studyPlan: IStudyPlan;
  getStudyPlans: Function;
  setIsLoading: Function;
}

export default function EditStudyPlanModal({
  career,
  studyPlan,
  getStudyPlans,
  setIsLoading,
}: IEditStudyPlanModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [name, setName] = useState<string>(convertToTitleCase(studyPlan.name));
  const [code, setCode] = useState<string>(studyPlan.code);
  const [period, setPeriod] = useState<string>(studyPlan.periodDenomination);

  const handleEditStudyPlan = async () => {
    // - Validacion de campos vacios - //
    if (name.trim() == "" || code.trim() == "") {
      toast({
        title: "Campos Vacios",
        description: "Por favor, rellene todos los campos.",
        variant: "left-accent",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // - PETICION PUT - //
    setIsLoading(true);
    try {
      const res = await fetch(`/api/studyPlans/${studyPlan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          code,
          period,
        }),
      });

      if (res.status == 200) {
        toast({
          title: "Plan de Estudio Editado",
          description: "El plan de estudio ha sido editado exitosamente.",
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        getStudyPlans();
        onClose();
      } else if (res.status == 400) {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.message,
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al editar el plan de estudio.",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al editar el plan de estudio.",
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
        icon={<FaEdit />}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Editar Plan de Estudio
      </MenuItem>

      {/* // -------- MODAL -------- // */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setName(convertToTitleCase(studyPlan.name));
          setCode(studyPlan.code);
        }}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Editar Plan de Estudio</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody py={4}>
            {/* // -------- INFORMACION DE LA CARRERA -------- // */}
            <Text>
              Se esta editando el plan de estudio:{" "}
              <Box as="span" fontWeight={"bold"}>
                {convertToTitleCase(studyPlan.name)}
              </Box>
            </Text>

            <Box mt={2}>
              Informacion de la carrera asociada al plan de estudio:
            </Box>

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
                onChange={(e) => setName(convertToTitleCase(e.target.value))}
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
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleEditStudyPlan}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
