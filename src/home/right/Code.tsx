import React, { memo, useLayoutEffect } from "react";
import Prism from 'prismjs';
import MarkdownIt from 'markdown-it';
import "../../css/prism.css";
import { Grid, Divider, Paper, Box, makeStyles } from "@material-ui/core";

type P = { code: string, language: string }

export const Code = memo(({ code, language }: P) => {
    useLayoutEffect(() => {
        if (language !== "Markdown" && language !== "Jupyter Notebook") {
            Prism.highlightAll();
        }
    }, [])
    if (language == "Markdown") {
        let htmlContent = MarkdownIt().render(code);
        return <Box width="100%"><div dangerouslySetInnerHTML={{ __html: htmlContent }} /></Box>;
    } else if (language == "Jupyter Notebook") {
        return <div>{code}</div>;
    } else {
        return <Box width="100%">
            <pre className="line-numbers">
                <code className={`language-${language.toLowerCase()}`}>
                    {code}
                </code>
            </pre>
        </Box>;
    }
});