import PayCard from "@/components/gestionSalarial/PayCard";
import PageHeader from "@/components/layout/headers/PageHeader";
import LoaderSpinner from "@/components/loaders/loaderSpinner";
import { IClasificacion } from "@/models/interfaces/clasificacionInterface";
import { Flex, useToast } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { useEffect, useState } from "react";
import NavbarSidebar from "../components/layout/NavSidebar";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // ------- CHECAR TOKEN DE SESION ------- //
  const token = await getToken({ req: context.req });

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const clasificaciones = ["a", "b", "c", "d", "i"];

const GestionSalarial = () => {
  const toast = useToast();

  // ---------- TIPOS DE DATOS QUE SE ESPERAN ---------- //

  // ---------- useState ---------- //
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true);
  const [DatosDB, SETDatosDB] = useState<IClasificacion[]>([]);
  const [DatosInputs, SETDatosInputs] = useState({
    clasificacion: "",
    primaria: 0,
    secundaria: 0,
    bachillerato: 0,
    universidad: 0,
    posgrado: 0,
    nocturna: 0,
    virtual: 0,
    taller: 0,
  });

  // ---------- PETICION GET  ---------- //
  const ObtenerPagoHora = async () => {
    setIsLoadingTable(true);
    try {
      const res = await fetch("/api/gestion-salarial/");
      const data = await res.json();
      SETDatosDB(data.pay);
      console.log(`Datos recibidos: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoadingTable(false);
  };

  // ---------- PRECARGADOR ---------- //
  const precargarClasificacion = () => {
    const clasificacion = DatosInputs.clasificacion;

    const precargado = DatosDB.find(
      (clasi) => clasi.clasificacion === clasificacion
    );

    if (precargado) {
      SETDatosInputs({
        ...DatosInputs,
        primaria: precargado.primaria,
        secundaria: precargado.secundaria,
        bachillerato: precargado.bachillerato,
        universidad: precargado.universidad,
        posgrado: precargado.posgrado,
        nocturna: precargado.nocturna,
        virtual: precargado.virtual,
        taller: precargado.taller,
      });
    } else {
      // Si no se encuentra una clasificación seleccionada, establecer todos los valores en cadena vacía
      SETDatosInputs({
        ...DatosInputs,
        primaria: 0,
        secundaria: 0,
        bachillerato: 0,
        universidad: 0,
        posgrado: 0,
        nocturna: 0,
        virtual: 0,
        taller: 0,
      });
    }
  };

  // ---------- PRECARGA ---------- //
  useEffect(() => {
    precargarClasificacion();
  }, [DatosInputs.clasificacion]);

  // ---------- INITIAL RENDER ---------- //
  useEffect(() => {
    ObtenerPagoHora();
  }, []);

  return isLoadingTable ? (
    <LoaderSpinner size="xl" paddingY="10rem" />
  ) : (
    <>
      <NavbarSidebar>
        <Flex
          direction={"column"}
          p={5}
          h={"100%"}
          w={"100%"}
          overflowY={"hidden"}
        >
          <PageHeader title={"Clasificaciones"} />
          <Flex
            w={"full"}
            h={"full"}
            py={5}
            gap={5}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            {clasificaciones.map((clasificacion: string) => {
              return (
                <PayCard
                  clasificacion={clasificacion}
                  key={`card-${clasificacion}`}
                />
              );
            })}
          </Flex>
        </Flex>
      </NavbarSidebar>
    </>
  );
};

export default GestionSalarial;
