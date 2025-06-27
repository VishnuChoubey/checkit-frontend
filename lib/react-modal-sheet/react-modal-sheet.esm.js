/* eslint-disable no-nested-ternary */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-use-before-define */
/* eslint-disable no-void */
/* eslint-disable no-cond-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-func-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import {
    useState,
    useEffect,
    useLayoutEffect,
    useContext,
    createContext,
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
    createElement,
    Children,
    cloneElement,
} from 'react';
import mergeRefs from 'react-merge-refs';
import {
    createPortal
} from 'react-dom';
import {
    useMotionValue,
    animate,
    AnimatePresence,
    motion,
    useTransform,
} from 'framer-motion';

let preSnapIndex = 1;

function _extends() {
    _extends = Object.assign || function(target) {
        for (let i = 1; i < arguments.length; i++) {
            const source = arguments[i];

            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    const target = {};
    const sourceKeys = Object.keys(source);
    let key;
    let
        i;

    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }

    return target;
}

const isSSR = typeof window === 'undefined';
const getClosest = function getClosest(nums, goal) {
    const point = nums.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));

    preSnapIndex = nums.indexOf(point);
    return point;
};
const getClosestBasedOnSpeedUp = function getClosestBasedOnSpeedUp(nums, goal) {
    preSnapIndex = preSnapIndex <= 0 ? 0 : preSnapIndex - 1;
    let point = nums[preSnapIndex];
    if (goal < point) {
        preSnapIndex -= 1;
        preSnapIndex = preSnapIndex < 0 ? 0 : preSnapIndex;
        point = nums[preSnapIndex];
    }
    return point || nums[0];
};

const getClosestBasedOnSpeedDown = function getClosestBasedOnSpeedDown(nums, goal) {
    preSnapIndex = preSnapIndex >= 2 ? 2 : preSnapIndex + 1;
    let point = nums[preSnapIndex];
    if (goal > point) {
        preSnapIndex += 1;
        preSnapIndex = preSnapIndex > 2 ? 2 : preSnapIndex;

        point = nums[preSnapIndex];
    }
    return point || nums[2];
};

const highlightId = 'react-modal-sheet-highlight';

function applyRootStyles(rootId) {
    const body = document.querySelector('body');
    const root = document.querySelector(`#${rootId}`);

    if (root) {
        const p = 24;
        const h = window.innerHeight;
        const s = (h - p) / h;
        body.style.backgroundColor = '#000';
        root.style.overflow = 'hidden';
        root.style.willChange = 'transform';
        root.style.transition = 'transform 200ms linear';
        root.style.transform = `translateY(calc(env(safe-area-inset-top) + ${p / 2}px)) scale(${s})`; // prettier-ignore

        root.style.borderTopRightRadius = '10px';
        root.style.borderTopLeftRadius = '10px'; // Add highlighed overlay to emphasize the modality effect

        const highlight = document.createElement('div');
        highlight.setAttribute('aria-hidden', 'true');
        highlight.id = highlightId;
        highlight.style.position = 'absolute';
        highlight.style.top = '0px';
        highlight.style.left = '0px';
        highlight.style.bottom = '0px';
        highlight.style.right = '0px';
        highlight.style.opacity = '0';
        highlight.style.transition = 'opacity 200ms linear';
        highlight.style.backgroundColor = 'rgba(150, 150, 150, 0.1)';
        root.appendChild(highlight);
        requestAnimationFrame(() => highlight.style.opacity = '1');
    }
}

function cleanupRootStyles(rootId) {
    const body = document.querySelector('body');
    const root = document.getElementById(rootId);
    const highlight = document.getElementById(highlightId);

    function onTransitionEnd() {
        let _highlight$parentNode;

        root.style.removeProperty('overflow');
        root.style.removeProperty('will-change');
        root.style.removeProperty('transition');
        body.style.removeProperty('background-color');
        root.removeEventListener('transitionend', onTransitionEnd);
        (_highlight$parentNode = highlight.parentNode) == null ? void 0 : _highlight$parentNode.removeChild(highlight);
    }

    if (root && highlight) {
        // Start animating back
        root.style.removeProperty('border-top-right-radius');
        root.style.removeProperty('border-top-left-radius');
        root.style.removeProperty('transform');
        highlight.style.opacity = '0'; // Remove temp properties after animation is finished

        root.addEventListener('transitionend', onTransitionEnd);
    }
}
const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;

function useWindowHeight() {
    const _useState = useState(0);
    const windowHeight = _useState[0];
    const setWindowHeight = _useState[1];

    useIsomorphicLayoutEffect(() => {
        const updateHeight = function updateHeight() {
            return setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', updateHeight);
        updateHeight();
        return function() {
            return window.removeEventListener('resize', updateHeight);
        };
    }, []);
    return windowHeight;
}
const inDescendingOrder = function inDescendingOrder(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i + 1] > arr[i]) return false;
    }

    return true;
};

const SheetContext = /* #__PURE__ */ createContext(undefined);
const useSheetContext = function useSheetContext() {
    const context = useContext(SheetContext);
    if (!context) throw Error('Sheet context error');
    return context;
};

const useModalEffect = function useModalEffect(isOpen, rootId) {
    const prevOpen = usePrevious(isOpen); // Automatically apply the iOS modal effect to the body when sheet opens/closes

    useEffect(() => {
        if (rootId && !prevOpen && isOpen) {
            applyRootStyles(rootId);
        } else if (rootId && !isOpen && prevOpen) {
            cleanupRootStyles(rootId);
        }
    }, [isOpen, prevOpen]); // eslint-disable-line
    // Make sure to cleanup modal styles on unmount

    useEffect(() => function() {
        if (rootId && isOpen) cleanupRootStyles(rootId);
    }, [isOpen]); // eslint-disable-line
};
const useEventCallbacks = function useEventCallbacks(isOpen, callbacks) {
    const prevOpen = usePrevious(isOpen);
    const didOpen = useRef(false); // Because of AnimatePrecence we don't have access to latest isOpen value
    // so we need to read and write to a ref to determine if we are
    // opening or closing the sheet

    const handleAnimationComplete = useCallback(() => {
        if (!didOpen.current) {
            callbacks.current.onOpenEnd == null ? void 0 : callbacks.current.onOpenEnd();
            didOpen.current = true;
        } else {
            callbacks.current.onCloseEnd == null ? void 0 : callbacks.current.onCloseEnd();
            didOpen.current = false;
        }
    }, [isOpen, prevOpen]); // eslint-disable-line

    useEffect(() => {
        if (!prevOpen && isOpen) {
            callbacks.current.onOpenStart == null ? void 0 : callbacks.current.onOpenStart();
        } else if (!isOpen && prevOpen) {
            callbacks.current.onCloseStart == null ? void 0 : callbacks.current.onCloseStart();
        }
    }, [isOpen, prevOpen]); // eslint-disable-line

    return {
        handleAnimationComplete,
    };
};

var usePrevious = function usePrevious(state) {
    const ref = useRef();
    useEffect(() => {
        ref.current = state;
    });
    return ref.current;
};

const styles = {
    wrapper: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999999,
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    backdrop: {
        zIndex: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(51, 51, 51, 0.5)',
        touchAction: 'none',
    },
    container: {
        zIndex: 2,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        borderTopRightRadius: '8px',
        borderTopLeftRadius: '8px',
        boxShadow: '0px -2px 16px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
    },
    headerWrapper: {
        width: '100%',
    },
    header: {
        height: '40px',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        width: '18px',
        height: '4px',
        borderRadius: '99px',
        backgroundColor: '#ddd',
    },
    content: {
        flex: 1,
        overflow: 'auto',
        position: 'relative',
    },
};

const Sheet = /* #__PURE__ */ forwardRef((_ref, ref) => {
    const {
        children
    } = _ref;
    const {
        isOpen
    } = _ref;
    const {
        onClose
    } = _ref;
    const {
        onOpenStart
    } = _ref;
    const {
        onOpenEnd
    } = _ref;
    const {
        onCloseStart
    } = _ref;
    const {
        onCloseEnd
    } = _ref;
    const {
        onSnap
    } = _ref;
    let {
        snapPoints
    } = _ref;
    const _ref$initialSnap = _ref.initialSnap;
    const initialSnap = _ref$initialSnap === void 0 ? 0 : _ref$initialSnap;
    const {
        rootId
    } = _ref;
    const _ref$springConfig = _ref.springConfig;
    const springConfig = _ref$springConfig === void 0 ? {
        stiffness: 300,
        damping: 30,
        mass: 0.2,
    } : _ref$springConfig;
    const _ref$disableDrag = _ref.disableDrag;
    const disableDrag = _ref$disableDrag === void 0 ? false : _ref$disableDrag;
    const rest = _objectWithoutPropertiesLoose(_ref, ['children', 'isOpen', 'onClose', 'onOpenStart', 'onOpenEnd', 'onCloseStart', 'onCloseEnd', 'onSnap', 'snapPoints', 'initialSnap', 'rootId', 'springConfig', 'disableDrag']);

    const sheetRef = useRef(null);
    const callbacks = useRef({
        onOpenStart,
        onOpenEnd,
        onCloseStart,
        onCloseEnd,
    }); // prettier-ignore

    const indicatorRotation = useMotionValue(0);
    const windowHeight = useWindowHeight(); // NOTE: the inital value for `y` doesn't matter since it is overwritten by
    // the value driven by the `AnimatePresence` component when the sheet is opened
    // and after that it is driven by the gestures and/or snapping

    const y = useMotionValue(0);

    if (snapPoints) {
        // Convert negative / percentage snap points to absolute values
        snapPoints = snapPoints.map((point) => {
            if (point > 0 && point <= 1) return point * windowHeight; // percentage values e.g. between 0.0 and 1.0

            return point < 0 ? windowHeight + point : point; // negative values
        });
        console.assert(inDescendingOrder(snapPoints) || windowHeight === 0, `Snap points need to be in descending order got: [${snapPoints}]`);
    }

    const handleDrag = useCallback((_, _ref2) => {
        const {
            delta
        } = _ref2;
        // Update drag indicator rotation based on drag velocity
        const velocity = y.getVelocity();
        if (velocity > 0) indicatorRotation.set(10);
        if (velocity < 0) indicatorRotation.set(-10); // Make sure user cannot drag beyond the top of the sheet

        y.set(Math.max(y.get() + delta.y, 0));
    }, []); // eslint-disable-line

    const handleDragEnd = useCallback((_, _ref3) => {
            const {
                velocity
            } = _ref3;
            if (velocity.y > 100) {
                // User flicked the sheet down
                // onClose();
                const sheetEl = sheetRef.current;
                const contentHeight = sheetEl.getBoundingClientRect().height;
                const snapTo = getClosestBasedOnSpeedDown(snapPoints.map((p) => contentHeight - p), y.get());
                animate(y, snapTo, {
                    type: 'spring',
                    ...springConfig
                });
            } else if (velocity.y < -100) {
                const sheetEl = sheetRef.current;
                const contentHeight = sheetEl.getBoundingClientRect().height;
                const snapTo = getClosestBasedOnSpeedUp(snapPoints.map((p) => contentHeight - p), y.get());
                animate(y, snapTo, {
                    type: 'spring',
                    ...springConfig
                });
            } else {
                const sheetEl = sheetRef.current;
                const contentHeight = sheetEl.getBoundingClientRect().height;
                const snapTo = snapPoints ? getClosest(snapPoints.map((p) => contentHeight - p), y.get()) // prettier-ignore
                    :
                    y.get() / contentHeight > 0.6 // Close if dragged over 60%
                    ?
                    contentHeight : 0; // Update the spring value so that the sheet is animated to the snap point
                animate(y, snapTo, {
                    type: 'spring',
                    ...springConfig
                });

                if (snapPoints && onSnap) {
                    const snapValue = Math.abs(Math.round(snapPoints[0] - snapTo));
                    const snapIndex = snapPoints.indexOf(snapValue);
                    onSnap(snapIndex);
                }

                if (snapTo >= contentHeight) onClose();
            } // Reset indicator rotation after dragging

            indicatorRotation.set(0);
        }, [onClose, onSnap] // eslint-disable-line

        // eslint-disable-next-line function-paren-newline
    ); // Keep the callback fns up-to-date so that they can be accessed inside
    // the effect without including them to the dependencies array

    useEffect(() => {
        callbacks.current = {
            onOpenStart,
            onOpenEnd,
            onCloseStart,
            onCloseEnd,
        };
    }); // Trigger onSnap callback when sheet is opened or closed

    useEffect(() => {
        if (!snapPoints || !onSnap) return;
        const snapIndex = isOpen ? initialSnap : snapPoints.length - 1;
        onSnap(snapIndex);
    }, [isOpen]); // eslint-disable-line

    useImperativeHandle(ref, () => ({
        y,
        snapTo: function snapTo(snapIndex) {
            const sheetEl = sheetRef.current;

            if (snapPoints && snapPoints[snapIndex] !== undefined && sheetEl !== null) {
                const contentHeight = sheetEl.getBoundingClientRect().height;
                const snapTo2 = contentHeight - snapPoints[snapIndex];
                animate(y, snapTo2, {
                    type: 'spring',
                    ...springConfig
                });
                if (onSnap) onSnap(snapIndex);
                if (snapTo2 >= contentHeight) onClose();
            }
        },
    }));
    useModalEffect(isOpen, rootId);
    const dragProps = disableDrag ? {} : {
        drag: 'y',
        dragElastic: 0,
        dragConstraints: {
            top: 0,
            bottom: 0,
        },
        dragMomentum: false,
        onDrag: handleDrag,
        onDragEnd: handleDragEnd,
    };
    const context = {
        y,
        sheetRef,
        isOpen,
        initialSnap,
        snapPoints,
        indicatorRotation,
        callbacks,
        dragProps,
        windowHeight,
        springConfig,
    };

    const wrapperProps = {
        ...rest,
        ref,
        style: styles.wrapper,
    };

    const sheet = createElement(SheetContext.Provider, {
        value: context,
    }, createElement('div', { ...wrapperProps
    }, createElement(AnimatePresence, null, isOpen ? Children.map(children, (child, i) => cloneElement(child, {
        key: `sheet-child-${i}`,
    })) : null)));
    if (isSSR) return sheet;
    return createPortal(sheet, document.body);
});

const MAX_HEIGHT = 'calc(100% - env(safe-area-inset-top) - 34px)';
const SheetContainer = /* #__PURE__ */ forwardRef((_ref, ref) => {
    const {
        children
    } = _ref;
    const _ref$style = _ref.style;
    const style = _ref$style === void 0 ? {} : _ref$style;
    const rest = _objectWithoutPropertiesLoose(_ref, ['children', 'style']);

    const _useSheetContext = useSheetContext();
    const {
        y
    } = _useSheetContext;
    const {
        isOpen
    } = _useSheetContext;
    const {
        callbacks
    } = _useSheetContext;
    const {
        snapPoints
    } = _useSheetContext;
    const _useSheetContext$init = _useSheetContext.initialSnap;
    const initialSnap = _useSheetContext$init === void 0 ? 0 : _useSheetContext$init;
    const {
        sheetRef
    } = _useSheetContext;
    const {
        windowHeight
    } = _useSheetContext;
    const {
        springConfig
    } = _useSheetContext;

    const _useEventCallbacks = useEventCallbacks(isOpen, callbacks);
    const {
        handleAnimationComplete
    } = _useEventCallbacks;

    const initialY = snapPoints ? snapPoints[0] - snapPoints[initialSnap] : 0;
    const h = snapPoints ? snapPoints[0] : null;
    const sheetHeight = h ? `min(${h}px, ${MAX_HEIGHT})` : MAX_HEIGHT;
    return createElement(motion.div, {
        ...rest,
        ref: mergeRefs([sheetRef, ref]),
        className: 'react-modal-sheet-container',
        style: {
            ...styles.container,
            height: sheetHeight,
            ...style,
            y,
        },
        initial: {
            y: windowHeight,
        },
        animate: {
            y: initialY,
            transition: {
                type: 'spring',
                ...springConfig
            },
        },
        exit: {
            y: windowHeight,
        },
        onAnimationComplete: handleAnimationComplete,
    }, children);
});

const SheetContent = /* #__PURE__ */ forwardRef((_ref, ref) => {
    const {
        children
    } = _ref;
    const _ref$disableDrag = _ref.disableDrag;
    const disableDrag = _ref$disableDrag === void 0 ? false : _ref$disableDrag;
    const _ref$style = _ref.style;
    const style = _ref$style === void 0 ? {} : _ref$style;
    const rest = _objectWithoutPropertiesLoose(_ref, ['children', 'disableDrag', 'style']);

    const _useSheetContext = useSheetContext();
    const {
        dragProps
    } = _useSheetContext;

    return createElement(motion.div, {
        ...rest,
        ref,
        className: 'react-modal-sheet-content',
        style: { ...styles.content,
            ...style
        },
        ...(disableDrag ? {} : dragProps),
    }, children);
});

const SheetHeader = /* #__PURE__ */ forwardRef((_ref, ref) => {
    const {
        children
    } = _ref;
    const _ref$disableDrag = _ref.disableDrag;
    const disableDrag = _ref$disableDrag === void 0 ? false : _ref$disableDrag;
    const _ref$style = _ref.style;
    const style = _ref$style === void 0 ? {} : _ref$style;
    const rest = _objectWithoutPropertiesLoose(_ref, ['children', 'disableDrag', 'style']);

    const _useSheetContext = useSheetContext();
    const {
        indicatorRotation
    } = _useSheetContext;
    const {
        dragProps
    } = _useSheetContext;

    const indicator1Transform = useTransform(indicatorRotation, (r) => `translateX(2px) rotate(${r}deg)`);
    const indicator2Transform = useTransform(indicatorRotation, (r) => `translateX(-2px) rotate(${-1 * r}deg)`);
    return createElement(motion.div, {
        ...rest,
        ref,
        style: { ...styles.headerWrapper,
            ...style
        },
        ...(disableDrag ? {} : dragProps),
    }, children || createElement('div', {
        className: 'react-modal-sheet-header',
        style: styles.header,
    }, createElement(motion.span, {
        className: 'react-modal-sheet-drag-indicator',
        style: { ...styles.indicator,
            transform: indicator1Transform
        },
    }), createElement(motion.span, {
        className: 'react-modal-sheet-drag-indicator',
        style: { ...styles.indicator,
            transform: indicator2Transform
        },
    })));
});

const isClickable = function isClickable(props) {
    return !!props.onClick || !!props.onTap;
};

const SheetBackdrop = /* #__PURE__ */ forwardRef((_ref, ref) => {
    const _ref$style = _ref.style;
    const style = _ref$style === void 0 ? {} : _ref$style;
    const rest = _objectWithoutPropertiesLoose(_ref, ['style']);

    const Comp = isClickable(rest) ? motion.button : motion.div;
    const pointerEvents = isClickable(rest) ? 'auto' : 'none';
    return createElement(Comp, {
        ...rest,
        ref,
        className: 'react-modal-sheet-backdrop',
        style: { ...styles.backdrop,
            ...style,
            pointerEvents
        },
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
        },
        exit: {
            opacity: 0,
        },
    });
});

const _Sheet = Sheet;
_Sheet.Container = SheetContainer;
_Sheet.Header = SheetHeader;
_Sheet.Content = SheetContent;
_Sheet.Backdrop = SheetBackdrop;
const SheetCompound = _Sheet;

export default SheetCompound;
// # sourceMappingURL=react-modal-sheet.esm.js.map