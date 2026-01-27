import React from 'react';
import { Sheet, Dialog, YStack, XStack, Text, Button as TamaguiButton } from 'tamagui';
import { X } from '@tamagui/lucide-icons';
import type { SheetProps } from '@tamagui/sheet';

// ═══════════════════════════════════════════════════════════════════
// 📱 MODAL - Système de modales (BottomSheet & Dialog)
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// BOTTOM SHEET MODAL (mobile-first)
// ─────────────────────────────────────────────────────────────────
type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
  title?: string;
  dismissOnSnapToBottom?: boolean;
  showHandle?: boolean;
};

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  children,
  snapPoints = [85, 50],
  title,
  dismissOnSnapToBottom = true,
  showHandle = true,
}) => {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      snapPoints={snapPoints}
      dismissOnSnapToBottom={dismissOnSnapToBottom}
      animation="quick"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="$overlay5"
      />
      
      <Sheet.Frame
        padding="$4"
        paddingTop="$6"
        backgroundColor="$backgroundStrong"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      >
        {showHandle && <Sheet.Handle />}
        
        {title && (
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$4"
          >
            <Text
              fontSize="$6"
              fontWeight="900"
              color="$colorPrimary"
            >
              {title}
            </Text>
            
            <TamaguiButton
              circular
              size="$3"
              chromeless
              icon={<X size={20} color="$colorMuted" />}
              onPress={onClose}
            />
          </XStack>
        )}
        
        <YStack flex={1}>
          {children}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

// ─────────────────────────────────────────────────────────────────
// DIALOG MODAL (desktop/tablet)
// ─────────────────────────────────────────────────────────────────
type DialogModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
};

export const DialogModal: React.FC<DialogModalProps> = ({
  open,
  onClose,
  children,
  title,
  description,
  showCloseButton = true,
}) => {
  return (
    <Dialog modal open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="$overlay7"
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          backgroundColor="$backgroundStrong"
          padding="$5"
          borderRadius="$6"
          maxWidth={500}
        >
          {title && (
            <Dialog.Title fontSize="$6" fontWeight="900" color="$colorPrimary">
              {title}
            </Dialog.Title>
          )}

          {description && (
            <Dialog.Description fontSize="$4" color="$colorSecondary">
              {description}
            </Dialog.Description>
          )}

          <YStack gap="$4">
            {children}
          </YStack>

          {showCloseButton && (
            <Dialog.Close asChild>
              <TamaguiButton
                position="absolute"
                top="$3"
                right="$3"
                circular
                chromeless
                icon={<X size={20} />}
                onPress={onClose}
              />
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────────────────
// CONFIRM MODAL (avec actions)
// ─────────────────────────────────────────────────────────────────
import { Button } from './Button';

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isBottomSheet?: boolean;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'primary',
  isBottomSheet = true,
}) => {
  const content = (
    <>
      {message && (
        <Text fontSize="$4" color="$colorSecondary">
          {message}
        </Text>
      )}
      
      <XStack gap="$3" marginTop="$4">
        <Button
          flex={1}
          variant="ghost"
          onPress={onClose}
        >
          {cancelLabel}
        </Button>
        
        <Button
          flex={1}
          variant={variant}
          onPress={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </XStack>
    </>
  );

  if (isBottomSheet) {
    return (
      <BottomSheet
        open={open}
        onClose={onClose}
        title={title}
        snapPoints={[40]}
      >
        {content}
      </BottomSheet>
    );
  }

  return (
    <DialogModal
      open={open}
      onClose={onClose}
      title={title}
      showCloseButton={false}
    >
      {content}
    </DialogModal>
  );
};

// Alias principal (mobile-first)
export const Modal = BottomSheet;

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Options">
//   <YStack gap="$3">
//     <Button>Action 1</Button>
//     <Button>Action 2</Button>
//   </YStack>
// </Modal>
//
// <ConfirmModal
//   open={confirmOpen}
//   onClose={() => setConfirmOpen(false)}
//   onConfirm={handleDelete}
//   title="Supprimer la partie ?"
//   message="Cette action est irréversible"
//   variant="danger"
// />
