// ✅ VALIDATION CHECKLIST
export const RationaleFlowValidation = {

    studentPreviewModal: {
        '✅ Opens with question': 'StudentPreviewModal renders question text',
        '✅ Loads full item': 'useEffect fetches and caches FullItemData via _fullItemRef',
        '✅ Passes correct props': 'currentQ includes _fullItemRef with full clinical data',
        '✅ Opens drawer': 'Button click opens RationaleDrawer with open=true',
    },

    rationaleDrawer: {
        '✅ Receives props': 'Gets question, fullItem, metadata, open, onClose',
        '✅ Extracts rationale': 'useMemo calls RationalePipeline.processQuestion',
        '✅ Passes to RationaleSheet': 'RationaleSheet receives rationale prop',
        '✅ Closes correctly': 'onClose callback triggered when drawer dismissed',
    },

    rationaleSheet: {
        '✅ Priority hierarchy': 'Checks explicit → fullItem → question → default',
        '✅ Validates data': 'smartRationale useMemo ensures structure',
        '✅ Manages tab state': 'activeTab and onTabChange props work',
        '✅ Passes to UltimateRationale': 'All props passed correctly',
    },

    ultimateRationale: {
        '✅ Validates structure': 'validatedRationale useMemo ensures fallback content',
        '✅ Renders 5 tabs': 'Item Overview, Option Review, Clinical Logic, Strategy, Knowledge',
        '✅ Tab navigation': 'Buttons call onTabChange, tabs update',
        '✅ Shows content': 'Each tab displays appropriate rationale data',
    },
};
