import NavbarSidebar from "@/components/layout/NavSidebar";
import PageHeader from "@/components/layout/headers/PageHeader";
import { Box } from "@chakra-ui/react";
import Chart from "chart.js/auto";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { useEffect, useRef } from "react";

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

export default function Home() {
  const annualReportChartRef = useRef<any>(null);
  const bestCareersChartRef = useRef<any>(null);
  const bestClassesChartRef = useRef<any>(null);

  useEffect(() => {
    const annualReportChartCanvas = annualReportChartRef.current;
    const bestCareersChartCanvas = bestCareersChartRef.current;
    const bestClassesChartCanvas = bestClassesChartRef.current;

    if (annualReportChartCanvas)
      Chart.getChart(annualReportChartCanvas)?.destroy();
    if (bestCareersChartCanvas)
      Chart.getChart(bestCareersChartCanvas)?.destroy();
    if (bestClassesChartCanvas)
      Chart.getChart(bestClassesChartCanvas)?.destroy();

    const annualReportChart = new Chart(annualReportChartCanvas, {
      type: "bar",
      data: {
        labels: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
        ],
        datasets: [
          {
            label: "Reporte Anual",
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const bestCareersChart = new Chart(bestCareersChartCanvas, {
      type: "pie",
      data: {
        labels: ["Ingeniería", "Medicina", "Derecho"],
        datasets: [
          {
            label: "Mejores Carreras",
            data: [30, 20, 50],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const bestClassesChart = new Chart(bestClassesChartCanvas, {
      type: "pie",
      data: {
        labels: ["Matemáticas", "Física", "Historia"],
        datasets: [
          {
            label: "Mejores Clases",
            data: [40, 30, 30],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, []);

  return (
    <div>
      <NavbarSidebar>
        <Box p={5}>
          <PageHeader title={"Inicio"} />
          <div className="grid grid-cols-3 gap-4 py-6">
            <div className="col-span-2">
              <div className="border rounded-lg p-4 h-full">
                <canvas
                  ref={annualReportChartRef}
                  id="annual-report-chart"
                  className="w-full h-full"
                ></canvas>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-between">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Mejores Carreras</h2>
                <div className="border rounded-lg p-4">
                  <canvas
                    ref={bestCareersChartRef}
                    id="best-careers-chart"
                    className="h-48"
                  ></canvas>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Mejores Clases</h2>
                <div className="border rounded-lg p-4">
                  <canvas
                    ref={bestClassesChartRef}
                    id="best-classes-chart"
                    className="h-48"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </NavbarSidebar>
    </div>
  );
}
