import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
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
import { FaUniversity } from "react-icons/fa";

interface AddCareerModalProps {
  setIsLoading: Function;
  refreshTable: Function;
}

export default function AddCareerModal({
  setIsLoading,
  refreshTable,
}: AddCareerModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [careerName, setCareerName] = useState<string>("");
  const [careerCode, setCareerCode] = useState<string>("");
  const [academicLevel, setAcademicLevel] = useState<string>("");

  // -------- FUNCION PARA REGISTRAR CARRERA -------- //
  const registerCareer = async () => {
    if (
      careerName.trim() === "" ||
      careerCode.trim() === "" ||
      academicLevel.trim() === ""
    ) {
      toast({
        title: "Error al registrar la carrera",
        description: "Todos los campos son obligatorios",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // - PETICION POST - //
    setIsLoading(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: careerName,
          careerCode,
          academicLevel,
        }),
      });

      if (res.status == 200) {
        toast({
          title: "Carrera registrada",
          description: "La carrera se ha registrado correctamente",
          variant: "left-accent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        refreshTable();
        onClose();
        setCareerName("");
        setCareerCode("");
        setAcademicLevel("");
      } else if (res.status == 400) {
        const data = await res.json();

        toast({
          title: "Error al registrar la carrera",
          description: data.message,
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error al registrar la carrera",
          description: "Ha ocurrido un error al registrar la carrera",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al registrar la carrera",
        description: "Ha ocurrido un error al registrar la carrera",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      <Button gap={2} colorScheme="green" variant={"outline"} onClick={onOpen}>
        <FaUniversity />
        Registrar Carrera
      </Button>

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Registrar Carrera</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody py={4}>
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
            <Button colorScheme="green" onClick={registerCareer}>
              Registrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
