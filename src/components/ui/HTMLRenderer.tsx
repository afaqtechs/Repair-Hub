
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

type Props = {
    html?: string | null;
    fontSize?: number;
    lineHeight?: number;
};

const HTMLRenderer = ({
    html,
    fontSize = 16,
    lineHeight = 24,
}: Props) => {

    const { width } = useWindowDimensions();


    return (
        <RenderHTML
            contentWidth={width}
            source={{
                html: html || "<p>No content available</p>",
            }}
            tagsStyles={{
                body: {
                    color: "#F8FAFC",
                    fontFamily: "Manrope",
                    fontSize,
                    lineHeight,
                },

                p: {
                    marginBottom: 8,
                },

                h1: {
                    fontSize: 24,
                    fontWeight: "700",
                },

                h2: {
                    fontSize: 20,
                    fontWeight: "700",
                },

                strong: {
                    fontWeight: "bold",
                },

                a: {
                    color: "#6366F1",
                },

                ul: {
                    marginBottom: 8,
                },

                li: {
                    marginBottom: 4,
                },
            }}
        />
    );
};


export default HTMLRenderer;