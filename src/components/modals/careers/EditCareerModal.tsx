import { convertToTitleCase } from "@/utils/titleCase";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface EditCareerModalProps {
  career: ICareer;
  refreshTable: Function;
  setIsLoading: Function;
}

export default function EditCareerModal({
  career,
  refreshTable,
  setIsLoading,
}: EditCareerModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [careerName, setCareerName] = useState<string>(
    convertToTitleCase(career.name)
  );
  const [careerCode, setCareerCode] = useState<string>(career.careerCode);
  const [academicLevel, setAcademicLevel] = useState<string>(
    career.academicLevel
  );

  const updateCareer = async () => {
    // - VALIDACION DE PARAMETROS - //
    if (
      careerName.trim() == "" ||
      careerCode.trim() == "" ||
      academicLevel == ""
    ) {
      toast({
        title: "Error al actualizar la carrera.",
        description: "Todos los campos son requeridos.",
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
      const res = await fetch(`/api/careers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: career._id,
          name: careerName,
          careerCode,
          academicLevel,
        }),
      });

      if (res.status == 200) {
        toast({
          title: "Carrera actualizada.",
          description: "La carrera se ha actualizado correctamente.",
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        refreshTable();
        onClose();
      } else if (res.status == 400) {
        const data = await res.json();

        toast({
          title: "Error al actualizar la carrera.",
          description: data.message,
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error al actualizar la carrera.",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al actualizar la carrera.",
        description: "Ocurrio un error al actualizar la carrera.",
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
        Editar Carrera
      </MenuItem>

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Editar Carrera</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            {/* // -------- NOMBRE DE CARRERA -------- // */}
            <FormControl isRequired>
              <FormLabel>Nombre:</FormLabel>
              <Input
                placeholder="Nombre de la carrera"
                value={careerName}
                onChange={(e) => setCareerName(e.target.value)}
              />
            </FormControl>

            {/* // -------- CODIGO DE CARRERA -------- // */}
            <FormControl isRequired mt={4}>
              <FormLabel>Codigo de carrera:</FormLabel>
              <Input
                placeholder="Codigo de la carrera"
                value={careerCode}
                onChange={(e) => setCareerCode(e.target.value)}
              />
            </FormControl>

            {/* // -------- NIVEL ACADEMICO -------- // */}
            <FormControl isRequired mt={4}>
              <FormLabel>Nivel Academico:</FormLabel>
              <Select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
              >
                <option value="">Seleccione el nivel academico...</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="bachillerato">Bachillerato</option>
                <option value="universidad">
                  Universidad Vespertina/Matutina
                </option>
                <option value="nocturna">Universidad Nocturna</option>
                <option value="virtual">Universidad Virtual</option>
                <option value="posgrado">Posgrado</option>
                <option value="taller">Taller</option>
              </Select>
            </FormControl>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            <Button colorScheme="green" onClick={updateCareer}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
