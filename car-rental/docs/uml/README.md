# UML Diagrams

This folder contains the project UML sources:

- `class-diagram.puml`
- `use-case-diagram.puml`

## Render options

1. VS Code PlantUML extension: open `.puml` file and run `PlantUML: Preview Current Diagram`.
2. PlantUML CLI:

```bash
plantuml -tsvg class-diagram.puml use-case-diagram.puml
```

This generates crisp, scalable SVG outputs next to each source file.

For high-resolution PNG output, add `skinparam dpi 300` near the top of each `.puml` file and run:

```bash
plantuml -tpng class-diagram.puml use-case-diagram.puml
```
