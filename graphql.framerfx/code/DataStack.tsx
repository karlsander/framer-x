import * as React from "react"
import { useEffect, useMemo } from "react"
import {
    Frame,
    addPropertyControls,
    ControlType,
    Stack,
    RenderTarget,
} from "framer"
import useFetch from "use-http"
import deepIterator from "deep-iterator"
import * as moment from "moment"

enum Direction {
    Vertical = "vertical",
    Horizontal = "horizontal",
}

enum Alignment {
    Start = "start",
    Center = "center",
    End = "end",
}

enum Distribution {
    Start = "start",
    Center = "center",
    End = "end",
    SpaceBetween = "space-between",
    SpaceAround = "space-around",
    SpaceEvenly = "space-evenly",
}

enum DateFormat {
    None = "No Formating",
    Date = "Date",
    Time = "Time",
    DateTime = "Date & Time",
    TimeAgo = "Time Ago",
    Custom = "Custom",
}

const GraphQLLogo = props => (
    <svg viewBox="0 0 400 400" {...props}>
        <path
            fill="#E535AB"
            d="M57.468 302.66l-14.376-8.3 160.15-277.38 14.376 8.3z"
        />
        <path fill="#E535AB" d="M39.8 272.2h320.3v16.6H39.8z" />
        <path
            fill="#E535AB"
            d="M206.348 374.026l-160.21-92.5 8.3-14.376 160.21 92.5zM345.522 132.947l-160.21-92.5 8.3-14.376 160.21 92.5z"
        />
        <path
            fill="#E535AB"
            d="M54.482 132.883l-8.3-14.375 160.21-92.5 8.3 14.376z"
        />
        <path
            fill="#E535AB"
            d="M342.568 302.663l-160.15-277.38 14.376-8.3 160.15 277.38zM52.5 107.5h16.6v185H52.5z"
        />
        <path fill="#E535AB" d="M330.9 107.5h16.6v185h-16.6z" />
        <path
            fill="#E535AB"
            d="M203.522 367l-7.25-12.558 139.34-80.45 7.25 12.557z"
        />
        <path
            fill="#E535AB"
            d="M369.5 297.9c-9.6 16.7-31 22.4-47.7 12.8-16.7-9.6-22.4-31-12.8-47.7 9.6-16.7 31-22.4 47.7-12.8 16.8 9.7 22.5 31 12.8 47.7M90.9 137c-9.6 16.7-31 22.4-47.7 12.8-16.7-9.6-22.4-31-12.8-47.7 9.6-16.7 31-22.4 47.7-12.8 16.7 9.7 22.4 31 12.8 47.7M30.5 297.9c-9.6-16.7-3.9-38 12.8-47.7 16.7-9.6 38-3.9 47.7 12.8 9.6 16.7 3.9 38-12.8 47.7-16.8 9.6-38.1 3.9-47.7-12.8M309.1 137c-9.6-16.7-3.9-38 12.8-47.7 16.7-9.6 38-3.9 47.7 12.8 9.6 16.7 3.9 38-12.8 47.7-16.7 9.6-38.1 3.9-47.7-12.8M200 395.8c-19.3 0-34.9-15.6-34.9-34.9 0-19.3 15.6-34.9 34.9-34.9 19.3 0 34.9 15.6 34.9 34.9 0 19.2-15.6 34.9-34.9 34.9M200 74c-19.3 0-34.9-15.6-34.9-34.9 0-19.3 15.6-34.9 34.9-34.9 19.3 0 34.9 15.6 34.9 34.9 0 19.3-15.6 34.9-34.9 34.9"
        />
    </svg>
)

function formatDate(date, dateFormat, customDateFormat) {
    switch (dateFormat) {
        case DateFormat.None:
            return date
        case DateFormat.Date:
            return moment(date).format("MMMM Do YYYY")
        case DateFormat.Time:
            return moment(date).format("H:mm")
        case DateFormat.DateTime:
            return moment(date).format("MMMM Do YYYY h:mm")
        case DateFormat.TimeAgo:
            return moment(date).fromNow()
        case DateFormat.Custom:
            return moment(date).format(customDateFormat)
        default:
            return "pick a date format"
    }
}

export function DataStack({
    query: queryString,
    auth,
    children,
    direction,
    alignment,
    gap,
    padding,
    paddingPerSide,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    radius,
    distribute,
    overflow,
    width,
    height,
    loading: LoadingComponent,
    error: ErrorComponent,
    url,
    forceState,
    dateFormat,
    customDateFormat,
}) {
    let headers
    try {
        if (auth !== "" && auth[0] === "{") {
            headers = JSON.parse(auth)
        } else if (auth !== "") {
            headers = {
                Authorization: `Bearer ${auth}`,
            }
        } else {
            headers = {}
        }
    } catch (e) {
        console.log(
            "Failed to parse headers. Please enter them as JSON, including quotes"
        )
    }

    const { data, loading, error, query } = useFetch(url, { headers })

    useEffect(() => {
        query(queryString)
    }, [queryString])

    const Component = children[0]

    const { stack, stackProps } = useMemo(() => {
        let stack
        let stackProps = []

        for (let { key, value } of deepIterator(data)) {
            if (key === "stack") {
                stack = value
            }
        }

        if (stack) {
            stack.forEach(item => {
                let propObject = {}
                for (let { key, value, type } of deepIterator(item)) {
                    if (key) {
                        switch (type) {
                            case "String": {
                                if (key.toLowerCase().includes("date")) {
                                    propObject[key] = formatDate(
                                        value,
                                        dateFormat,
                                        customDateFormat
                                    )
                                } else {
                                    propObject[key] = value
                                }
                                propObject["key"] = propObject["key"] + value
                                break
                            }
                            case "Number": {
                                propObject[key] = String(value)
                                propObject["key"] =
                                    propObject["key"] + String(value)
                                break
                            }
                            default: {
                                break
                            }
                        }
                    }
                }
                stackProps.push(propObject)
            })
        }

        return { stack, stackProps }
    }, [data])

    if (data && stack && forceState === "none") {
        return (
            <Stack
                {...{
                    direction,
                    alignment,
                    gap,
                    padding,
                    paddingPerSide,
                    paddingTop,
                    paddingBottom,
                    paddingLeft,
                    paddingRight,
                    radius,
                    distribute,
                    overflow,
                    width,
                    height,
                }}
            >
                {stackProps.map(item =>
                    Component ? (
                        React.cloneElement(Component, {
                            ...item,
                            width: "100%",
                        })
                    ) : (
                        <DefaultComponent {...item} />
                    )
                )}
            </Stack>
        )
    } else if (RenderTarget.current() === RenderTarget.thumbnail) {
        return <GraphQLLogo />
    } else if (data && !stack) {
        return "No 'stack' data found. You need to rename a part of the result (eg: 'stack: allAlbums')"
    } else if (loading || forceState === "loading") {
        return LoadingComponent[0] || <div>loading</div>
    } else if (error || forceState === <div>error</div>) {
        return ErrorComponent[0] || <div>error</div>
    } else {
        return ErrorComponent[0] || <div>I have no idea what's going on.</div>
    }
}

const DefaultComponent = (props = {}) => {
    return (
        <Stack
            style={{ fontSize: 16, fontWeight: 600, color: "#333333" }}
            width="100%"
            alignment="center"
            distribution="center"
            background="#FFFFFF"
            {...props}
        >
            {Object.keys(props).map(k => (
                <p>
                    {k}: {props[k]}
                </p>
            ))}
        </Stack>
    )
}

DataStack.defaultProps = {
    height: 320,
    width: 375,
    radius: 0,
    forceState: "none",
    url: "https://api-euwest.graphcms.com/v1/cjyrk3mm403o901fu7n6935n4/master",
    query: `
{
  stack: hotels {
    name
    color {
      backgroundColor: hex
    }
    photo {
      hotelImage: url
    }
    openingDate
  }
}`,
}

addPropertyControls(DataStack, {
    radius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 0,
        min: 0,
        step: 1,
    },
    overflow: {
        type: ControlType.SegmentedEnum,
        options: ["visible", "hidden"],
        optionTitles: ["Show", "Hide"],
        title: "Overflow",
        defaultValue: "hidden",
    },
    direction: {
        type: ControlType.SegmentedEnum,
        options: [Direction.Horizontal, Direction.Vertical],
        title: "Direction",
        defaultValue: "vertical",
    },
    distribute: {
        type: ControlType.Enum,
        options: [
            Distribution.Start,
            Distribution.Center,
            Distribution.End,
            Distribution.SpaceBetween,
            Distribution.SpaceAround,
            Distribution.SpaceEvenly,
        ],
        optionTitles: [
            "Start",
            "Center",
            "End",
            "Space Between",
            "Space Around",
            "Space Evenly",
        ],
        title: "Distribute",
        defaultValue: "start",
    },
    alignment: {
        type: ControlType.SegmentedEnum,
        options: [Alignment.Start, Alignment.Center, Alignment.End],
        optionTitles: props =>
            props.direction === Direction.Vertical
                ? ["Left", "Center", "Right"]
                : ["Top", "Center", "Bottom"],
        title: "Align",
        defaultValue: "center",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 10,
        min: 0,
        step: 1,
    },
    padding: {
        type: ControlType.FusedNumber,
        toggleKey: "paddingPerSide",
        toggleTitles: ["Padding", "Padding per side"],
        valueKeys: [
            "paddingTop",
            "paddingRight",
            "paddingBottom",
            "paddingLeft",
        ],
        valueLabels: ["t", "r", "b", "l"],
        min: 0,
        title: "Padding",
        defaultValue: 0,
    },
    url: {
        type: ControlType.String,
        defaultValue:
            "https://api-euwest.graphcms.com/v1/cjyrk3mm403o901fu7n6935n4/master",
        placeholder: "Endpoint URL",
        title: "URL",
    },
    query: {
        type: ControlType.String,
        defaultValue: `
{
  stack: hotels {
    name
    color {
      backgroundColor: hex
    }
    photo {
      hotelImag: url
    }
    openingDate
  }
}`,
        placeholder: "Query",
        title: "Query",
    },
    auth: {
        type: ControlType.String,
        placeholder: "2jafksdfq3i4biljasbdf932ubflawjdhbfasldfjbaeupbjkasbdf",
        title: "Auth",
    },
    children: {
        type: ControlType.ComponentInstance,
        title: "Template",
    },
    loading: {
        type: ControlType.ComponentInstance,
        title: "Loading",
    },
    error: {
        type: ControlType.ComponentInstance,
        title: "Error",
    },
    forceState: {
        type: ControlType.SegmentedEnum,
        options: ["none", "loading", "error"],
        optionTitles: ["None", "Loading", "Error"],
        title: "Force State",
        defaultValue: "none",
    },
    dateFormat: {
        type: ControlType.Enum,
        options: [
            DateFormat.None,
            DateFormat.Date,
            DateFormat.Time,
            DateFormat.DateTime,
            DateFormat.TimeAgo,
            DateFormat.Custom,
        ],
        title: "Format Date",
        defaultValue: DateFormat.TimeAgo,
    },
    customDateFormat: {
        type: ControlType.String,
        title: "Custom Format",
        defaultValue: "dddd, MMMM Do YYYY, h:mm:ss a",
        hidden: ({ dateFormat }) => dateFormat !== DateFormat.Custom,
    },
})
