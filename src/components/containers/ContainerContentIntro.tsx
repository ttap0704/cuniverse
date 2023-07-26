import useAccountQuery from "@/queries/useAccountQuery";
import TypographyContentTitle from "../typography/TypographyContentTitle";
import useAccountUpdateMutation from "@/queries/useAccountUpdateMutation";
import ButtonSeeMore from "../buttons/ButtonSeeMore";
import TypographyContentDescription from "../typography/TypographyContentDescription";
import ContainerSeeMore from "./ContainerSeeMore";

function ContainerContentIntro() {
  const { data: account } = useAccountQuery();
  const { mutate: updateAccount } = useAccountUpdateMutation();

  return (
    <div className="container-content-intro">
      <TypographyContentTitle
        title={account?.nickname ? account.nickname : "Unnamed"}
      />
      <ContainerSeeMore>
        <TypographyContentDescription
          description={account?.description ? account.description : ""}
        />
      </ContainerSeeMore>
    </div>
  );
}

export default ContainerContentIntro;
