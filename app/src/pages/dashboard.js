import React from "react";
import DashboardSection from "./../components/DashboardSection";
import MyComponent from "../components/MyComponent";
import { DrizzleContext } from "@drizzle/react-plugin";

function DashboardPage(props) {
/*  const auth = useAuth();
  const router = useRouter();

  // Redirect to signin
  // if not signed in.
  useEffect(() => {
    if (auth.user === false) {
      router.push("/auth/signin");
    }
  }, [auth, router]);*/

  return (
      <DrizzleContext.Consumer>
          {drizzleContext => {
              const {drizzle, drizzleState, initialized} = drizzleContext;

              if(!initialized) {
                  return "Loading..."
              }
              return (
                  <>
                      <DashboardSection
                          color="white"
                          size="large"
                          title="Dashboard"
                          subtitle="Dashboard components are coming to the Divjoy library soon. For now, you can implement a custom dashboard here after exporting your code."
                      ></DashboardSection>
                      <MyComponent drizzle={drizzle} drizzleState={drizzleState} />
                  </>
              )
          }}
      </DrizzleContext.Consumer>

  );
}

export default DashboardPage;
