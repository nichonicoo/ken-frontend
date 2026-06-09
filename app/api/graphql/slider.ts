    const API_URL = "http://ken-web.local/graphql";


export async function getHomeSlider() {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        query: `
            {
            sliderHomes {
                nodes {
                title
                sliderFields {
                    sliderType
                    slideOrderNumber
                    slideImageHomes {
                    node {
                        sourceUrl
                    }
                    }
                }
                }
            }
            }
        `,
        }),
        cache: "no-store",
    });

    const json = await res.json();

    return json.data.sliderHomes.nodes;
}