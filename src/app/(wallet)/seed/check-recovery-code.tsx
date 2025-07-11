import React, { useState, useEffect } from "react";
import { Dimensions, SafeAreaView, ScrollView, TextInput } from "react-native";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { ThemeType } from "../../../styles/theme";
import CopyIcon from "../../../assets/svg/copy.svg";
import Button from "../../../components/Button/Button";
import Bubble from "../../../components/Bubble/Bubble";
import { ROUTES } from "../../../constants/routes";
import {
  Title,
  Subtitle,
  Errortitle,
} from "../../../components/Styles/Text.styles";
import { getPhrase } from "../../../hooks/useStorageState";
import * as bip39 from "bip39";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.lightDark};
  justify-content: center;
  align-items: center;
`;

async function generateMnemonic(numberOfWords: number) {
  const strength = (numberOfWords / 3) * 32; // 12 words = 128 bits, 24 words = 256 bits
  const mnemonic = await bip39.generateMnemonic(strength);
  console.log("Mnemonic:", mnemonic);
  return mnemonic;
}

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing.medium};
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  margin-bottom: ${(props) => props.theme.spacing.huge};
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.medium};
  width: 100%;
`;

const SeedPhraseContainer = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.medium};
`;

export const SecondaryButtonContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  height: 60px;
  margin-top: ${(props) => props.theme.spacing.medium};
`;

export const SecondaryButtonText = styled.Text<{ theme: ThemeType }>`
  margin-left: ${(props) => props.theme.spacing.small};
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

export const BlurContainer = styled(BlurView)<{ theme: ThemeType }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.medium};
  margin-left: ${(props) => props.theme.spacing.medium};
`;
export const SeedTextInput = styled.TextInput`
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.medium};
  margin: ${(props) => props.theme.spacing.large};
  background-color: ${(props) => props.theme.colors.dark};
  border-radius: ${(props) => props.theme.borderRadius.extraLarge};
  width: ${(Dimensions.get("window").width - 80).toFixed(0)}px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fonts.sizes.large};\
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  border: 1px solid ${(props) => props.theme.colors.grey}
`;
const LogoContainer = styled.View``;

export default function Page() {
  const theme = useTheme();
  const [buttonText, setButtonText] = useState("Copy to clipboard");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [flag, setFlag] = useState(false);
  const handleCopy = async () => {
    await Clipboard.setStringAsync(recoveryCode);
    setButtonText("Copied!");
    setTimeout(() => {
      setButtonText("Copy to clipboard");
    }, 4000);
  };

  const isValidRecoveryCode = (code) => {
    const regex = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){4}$/;
    return regex.test(code);
  };

  const handleApply = () => {
    if (recoveryCode != "") {
      if (isValidRecoveryCode(recoveryCode)) {
        router.push({
          pathname: ROUTES.walletCreatedSuccessfully,
          params: { successState: "CREATED_WALLET" },
        });
      } else {
        setFlag(true);
      }
    }
  };
  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={{ paddingTop: 50 }}>
        <ContentContainer>
          <TextContainer>
            <Title>Recovery Code</Title>
            <Subtitle>
              This is a recovery code for double security. Please store it
              somewhere safe!
            </Subtitle>
          </TextContainer>
          <SeedPhraseContainer>
            {flag ? <Errortitle>Please input correct format.</Errortitle> : ""}

            <SeedTextInput
              value={recoveryCode}
              readOnly={false}
              onChangeText={(text) => setRecoveryCode(text.toUpperCase())}
              placeholder="1QW3-08IH-JL84-005P"
              placeholderTextColor={theme.colors.grey}
            />
          </SeedPhraseContainer>
          <SecondaryButtonContainer onPress={handleCopy}>
            <LogoContainer>
              <CopyIcon fill={theme.colors.white} />
            </LogoContainer>
            <SecondaryButtonText>{buttonText}</SecondaryButtonText>
          </SecondaryButtonContainer>
        </ContentContainer>
      </ScrollView>

      <ButtonContainer>
        <Button
          color={theme.colors.white}
          linearGradient={theme.colors.primaryLinearGradient}
          onPress={handleApply}
          title="Ok, I saved it"
        />
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
