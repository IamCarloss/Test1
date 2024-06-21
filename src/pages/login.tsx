import LoaderModal from "@/components/loaders/loaderModal";
import {
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // ------- CHECAR TOKEN DE SESION ------- //
  const token = await getToken({ req: context.req });

  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login = () => {
  // -------- HOOKS -------- //
  const router = useRouter();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // -------- FUNCION PARA INICIAR SESION -------- //
  const handleLogin = async () => {
    // ------- VALIDAR QUE LOS CAMPOS NO ESTEN VACIOS ------- //
    if (!username || !password) {
      toast({
        title: "Error al iniciar sesión",
        description: "Por favor, llena todos los campos",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // ------- INICIAR SESION ------- //
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username: username,
      password: password,
    });

    if (!result?.error) {
      router.push("/");
    } else {
      toast({
        title: "Error al iniciar sesión",
        description: "Usuario o contraseña incorrectos",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex w-full">
        {/* // ------------- IMAGEN DE FONDO (SECCION DERECHA) ------------- // */}
        <div className="w-1/2 h-screen overflow-hidden">
          <img
            src={"/assets/ualAlumnos.jpg"}
            alt="UAL Alumnos"
            className="w-full h-full object-cover"
          />
        </div>

        {/* // ------------- FORMULARIO DE INICIO DE SESION (SECCION IZQUIERDA) ------------- // */}
        <div className="flex flex-col items-center justify-center w-1/2">
          <img src={"/assets/ual_login.png"} alt="ualLogin" className="mb-10" />
          <h2 className="text-4xl mb-10">Inicia Sesión</h2>

          <form
            className="mb-10"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* // - INPUT DE CORREO ELECTRONICO - // */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                borderRadius={12}
                colorScheme="green"
                focusBorderColor="green.600"
              />
            </div>

            {/* // - INPUT DE CONTRASEÑA - // */}
            <div className="mb-4">
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  borderRadius={12}
                  focusBorderColor="green.600"
                />

                <InputRightElement
                  cursor={"pointer"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputRightElement>
              </InputGroup>
            </div>

            {/* // - BOTON DE INICIAR SESION - // */}
            <button
              className="bg-green-600 text-white font-bold py-2 px-28 rounded-xl focus:outline-none focus:bg-green-800 "
              type="submit"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* // - ESLOGAN DE UAL - // */}
          <p className="text-2xl font-bold italic text-gray-600 mt-12 mb-28">
            {'"Vencimos al desierto, cultivamos el espíritu"'}
          </p>
        </div>
      </div>

      {/* // - LOADER MODAL - // */}
      <LoaderModal isLoading={isLoading} />
    </div>
  );
};

export default Login;
