"use client"

import * as React from "react"
import * as EditDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const EditDialog = EditDialogPrimitive.Root

const EditDialogTrigger = EditDialogPrimitive.Trigger

const EditDialogPortal = EditDialogPrimitive.Portal

const EditDialogOverlay = React.forwardRef<
  React.ElementRef<typeof EditDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof EditDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <EditDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
EditDialogOverlay.displayName = EditDialogPrimitive.Overlay.displayName

const EditDialogContent = React.forwardRef<
  React.ElementRef<typeof EditDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof EditDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <EditDialogPortal>
    <EditDialogOverlay />
    <EditDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid min-w-[calc(100dvw-64px)] sm:min-w-fit max-w-[512px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background px-8 py-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
        className
      )}
      {...props}
    />
  </EditDialogPortal>
))
EditDialogContent.displayName = EditDialogPrimitive.Content.displayName

const EditDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
EditDialogHeader.displayName = "EditDialogHeader"

const EditDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex justify-center sm:justify-end space-x-2",
      className
    )}
    {...props}
  />
)
EditDialogFooter.displayName = "EditDialogFooter"

const EditDialogTitle = React.forwardRef<
  React.ElementRef<typeof EditDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof EditDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <EditDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
EditDialogTitle.displayName = EditDialogPrimitive.Title.displayName

const EditDialogDescription = React.forwardRef<
  React.ElementRef<typeof EditDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof EditDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <EditDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
EditDialogDescription.displayName =
  EditDialogPrimitive.Description.displayName

const EditDialogAction = React.forwardRef<
  React.ElementRef<typeof EditDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof EditDialogPrimitive.Action> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg";
  }
>(({ className, variant = "destructive", size = "lg", ...props }, ref) => (
  <EditDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
))
EditDialogAction.displayName = EditDialogPrimitive.Action.displayName

const EditDialogCancel = React.forwardRef<
  React.ElementRef<typeof EditDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof EditDialogPrimitive.Cancel> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg";
  }
>(({ className, variant = "outline", size = "lg",  ...props }, ref) => (
  <EditDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant, size}),
      className
    )}
    {...props}
  />
))
EditDialogCancel.displayName = EditDialogPrimitive.Cancel.displayName

export {
  EditDialog,
  EditDialogPortal,
  EditDialogOverlay,
  EditDialogTrigger,
  EditDialogContent,
  EditDialogHeader,
  EditDialogFooter,
  EditDialogTitle,
  EditDialogDescription,
  EditDialogAction,
  EditDialogCancel,
}
