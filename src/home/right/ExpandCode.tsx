import React, { useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { CodeFile } from '../../store/domainModel/CodeFile';
import { Code } from './Code';

const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

export function ExpandCode({ f }: { f: CodeFile }) {
    const ls = useLocalStore(() => ({
        isExpanded: true,
    }));
    const handleChange = useCallback((event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        ls.isExpanded = !ls.isExpanded;
    }, []);

    return useObserver(() => (
        <ExpansionPanel square expanded={ls.isExpanded} onChange={handleChange}>
            <ExpansionPanelSummary>
                <Typography>{f.fileName}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Code code={f.content!} language={f.language}></Code>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    ));
}
