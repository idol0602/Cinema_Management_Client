export interface chartType {
    type: "bar" | "line" | "pie";
    title?: string;
    xField?: string;
    yFields?: string[];

    labelField?: string;
    valueField?: string;
}