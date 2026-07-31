import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const escapeHtml = (value) => {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const sanitizeFileName = (name) => {
    const safeName = String(name ?? 'Recipe')
        .trim()
        .replace(/[^a-zA-Z0-9\s_-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_');

    return safeName || 'Recipe';
};

export const generateRecipePDF = async (recipe) => {
    if (!recipe) {
        throw new Error('Recipe data is missing.');
    }

    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : [];

    const steps = Array.isArray(recipe.steps)
        ? recipe.steps
        : [];

    const dietary = Array.isArray(recipe.dietary)
        ? recipe.dietary
        : [];

    const tags = Array.isArray(recipe.tags)
        ? recipe.tags
        : [];

    const container = document.createElement('div');

    container.style.position = 'fixed';
    container.style.left = '-100000px';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#0f172a';
    container.style.fontFamily = 'Arial, Helvetica, sans-serif';
    container.style.boxSizing = 'border-box';
    container.style.padding = '40px';
    container.style.zIndex = '-9999';

    container.innerHTML = `
    <div style="width:100%;box-sizing:border-box;background:#ffffff;">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:20px;
        padding-bottom:20px;
        border-bottom:3px solid #10b981;
      ">
        <div style="flex:1;">
          <div style="
            font-size:30px;
            font-weight:800;
            line-height:1.25;
            color:#0f172a;
          ">
            ${escapeHtml(recipe.img || '🍳')} ${escapeHtml(recipe.name || 'Recipe')}
          </div>

          ${recipe.desc
            ? `
                <div style="
                  margin-top:8px;
                  font-size:13px;
                  line-height:1.6;
                  color:#64748b;
                ">
                  ${escapeHtml(recipe.desc)}
                </div>
              `
            : ''
        }
        </div>

        <div style="
          flex-shrink:0;
          background:#ecfdf5;
          color:#059669;
          border:1px solid #a7f3d0;
          border-radius:999px;
          padding:7px 11px;
          font-size:10px;
          font-weight:700;
        ">
          ✨ ChefAI Generated
        </div>
      </div>

      <div style="
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-top:18px;
      ">
        <div style="
          background:#f1f5f9;
          border:1px solid #e2e8f0;
          border-radius:8px;
          padding:8px 10px;
          font-size:11px;
          font-weight:600;
          color:#475569;
        ">
          ⏱ Time: ${escapeHtml(recipe.time || 'N/A')}
        </div>

        <div style="
          background:#f1f5f9;
          border:1px solid #e2e8f0;
          border-radius:8px;
          padding:8px 10px;
          font-size:11px;
          font-weight:600;
          color:#475569;
        ">
          🍽 Servings: ${escapeHtml(recipe.servings || 'N/A')}
        </div>

        <div style="
          background:#f1f5f9;
          border:1px solid #e2e8f0;
          border-radius:8px;
          padding:8px 10px;
          font-size:11px;
          font-weight:600;
          color:#475569;
        ">
          👨‍🍳 Difficulty: ${escapeHtml(recipe.difficulty || 'N/A')}
        </div>
      </div>

      ${tags.length > 0
            ? `
            <div style="
              display:flex;
              flex-wrap:wrap;
              gap:6px;
              margin-top:14px;
            ">
              ${tags
                .map(
                    (tag) => `
                    <span style="
                      background:#f1f5f9;
                      border:1px solid #e2e8f0;
                      color:#475569;
                      border-radius:6px;
                      padding:4px 8px;
                      font-size:10px;
                      font-weight:600;
                    ">
                      🏷 ${escapeHtml(tag)}
                    </span>
                  `
                )
                .join('')}
            </div>
          `
            : ''
        }

      <div style="
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:9px;
        margin-top:20px;
      ">

        <div style="
          background:#ecfdf5;
          border:1px solid #d1fae5;
          border-radius:10px;
          padding:12px;
          text-align:center;
        ">
          <div style="font-size:9px;font-weight:700;color:#64748b;">
            CALORIES
          </div>
          <div style="
            margin-top:5px;
            font-size:17px;
            font-weight:800;
            color:#059669;
          ">
            ${escapeHtml(recipe.calories || 'N/A')}
          </div>
        </div>

        <div style="
          background:#eff6ff;
          border:1px solid #dbeafe;
          border-radius:10px;
          padding:12px;
          text-align:center;
        ">
          <div style="font-size:9px;font-weight:700;color:#64748b;">
            PROTEIN
          </div>
          <div style="
            margin-top:5px;
            font-size:17px;
            font-weight:800;
            color:#2563eb;
          ">
            ${escapeHtml(recipe.protein || 'N/A')}
          </div>
        </div>

        <div style="
          background:#fffbeb;
          border:1px solid #fef3c7;
          border-radius:10px;
          padding:12px;
          text-align:center;
        ">
          <div style="font-size:9px;font-weight:700;color:#64748b;">
            CARBS
          </div>
          <div style="
            margin-top:5px;
            font-size:17px;
            font-weight:800;
            color:#d97706;
          ">
            ${escapeHtml(recipe.carbs || 'N/A')}
          </div>
        </div>

        <div style="
          background:#fff1f2;
          border:1px solid #ffe4e6;
          border-radius:10px;
          padding:12px;
          text-align:center;
        ">
          <div style="font-size:9px;font-weight:700;color:#64748b;">
            FAT
          </div>
          <div style="
            margin-top:5px;
            font-size:17px;
            font-weight:800;
            color:#e11d48;
          ">
            ${escapeHtml(recipe.fat || 'N/A')}
          </div>
        </div>

      </div>

      <div style="margin-top:26px;">
        <div style="
          font-size:15px;
          font-weight:800;
          color:#059669;
          padding-bottom:7px;
          border-bottom:1px solid #e2e8f0;
        ">
          🛒 Ingredients
        </div>

        <div style="margin-top:8px;">
          ${ingredients.length > 0
            ? ingredients
                .map(
                    (item) => `
                      <div style="
                        display:flex;
                        gap:8px;
                        padding:6px 0;
                        border-bottom:1px solid #f1f5f9;
                        font-size:12px;
                        line-height:1.5;
                        color:#334155;
                      ">
                        <span style="
                          color:#10b981;
                          font-weight:700;
                        ">✓</span>
                        <span>${escapeHtml(item)}</span>
                      </div>
                    `
                )
                .join('')
            : `
                <div style="
                  padding-top:8px;
                  font-size:12px;
                  color:#64748b;
                ">
                  No ingredients available.
                </div>
              `
        }
        </div>
      </div>

      <div style="margin-top:26px;">
        <div style="
          font-size:15px;
          font-weight:800;
          color:#059669;
          padding-bottom:7px;
          border-bottom:1px solid #e2e8f0;
        ">
          👨‍🍳 Step-by-Step Instructions
        </div>

        <div style="margin-top:12px;">
          ${steps.length > 0
            ? steps
                .map(
                    (step, index) => `
                      <div style="
                        display:flex;
                        align-items:flex-start;
                        gap:10px;
                        margin-bottom:12px;
                        page-break-inside:avoid;
                      ">
                        <div style="
                          flex-shrink:0;
                          width:23px;
                          height:23px;
                          border-radius:50%;
                          background:#d1fae5;
                          color:#047857;
                          font-size:10px;
                          font-weight:800;
                          text-align:center;
                          line-height:23px;
                        ">
                          ${index + 1}
                        </div>

                        <div style="
                          flex:1;
                          font-size:12px;
                          line-height:1.6;
                          color:#334155;
                        ">
                          ${escapeHtml(step)}
                        </div>
                      </div>
                    `
                )
                .join('')
            : `
                <div style="
                  font-size:12px;
                  color:#64748b;
                ">
                  No instructions available.
                </div>
              `
        }
        </div>
      </div>

      ${recipe.tip
            ? `
            <div style="
              margin-top:22px;
              background:#fffbeb;
              border:1px solid #fde68a;
              border-left:4px solid #f59e0b;
              border-radius:9px;
              padding:13px;
              page-break-inside:avoid;
            ">
              <div style="
                font-size:12px;
                line-height:1.6;
                color:#78350f;
              ">
                💡 <strong>Chef Tip:</strong>
                ${escapeHtml(recipe.tip)}
              </div>
            </div>
          `
            : ''
        }

      ${dietary.length > 0
            ? `
            <div style="
              margin-top:22px;
              padding-top:12px;
              border-top:1px solid #e2e8f0;
            ">
              <div style="
                font-size:11px;
                font-weight:700;
                color:#64748b;
                margin-bottom:8px;
              ">
                🛡 Dietary Information
              </div>

              <div style="
                display:flex;
                flex-wrap:wrap;
                gap:6px;
              ">
                ${dietary
                .map(
                    (label) => `
                      <span style="
                        background:#f1f5f9;
                        color:#475569;
                        border-radius:999px;
                        padding:4px 8px;
                        font-size:9px;
                        font-weight:600;
                      ">
                        ${escapeHtml(label)}
                      </span>
                    `
                )
                .join('')}
              </div>
            </div>
          `
            : ''
        }

      <div style="
        margin-top:25px;
        padding-top:10px;
        border-top:1px solid #e2e8f0;
        text-align:center;
        font-size:9px;
        color:#94a3b8;
      ">
        Generated by ChefAI
      </div>

    </div>
  `;

    document.body.appendChild(container);

    try {
        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const canvas = await html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: false,
            logging: false,
            imageTimeout: 0,
        });

        if (!canvas.width || !canvas.height) {
            throw new Error('PDF canvas could not be created.');
        }

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 8;

        const contentWidth = pageWidth - margin * 2;
        const contentHeight =
            (canvas.height * contentWidth) / canvas.width;

        const usablePageHeight = pageHeight - margin * 2;
        const imageData = canvas.toDataURL('image/jpeg', 0.95);

        let remainingHeight = contentHeight;
        let yPosition = margin;

        pdf.addImage(
            imageData,
            'JPEG',
            margin,
            yPosition,
            contentWidth,
            contentHeight,
            undefined,
            'FAST'
        );

        remainingHeight -= usablePageHeight;

        while (remainingHeight > 0) {
            pdf.addPage();

            yPosition =
                margin - (contentHeight - remainingHeight);

            pdf.addImage(
                imageData,
                'JPEG',
                margin,
                yPosition,
                contentWidth,
                contentHeight,
                undefined,
                'FAST'
            );

            remainingHeight -= usablePageHeight;
        }

        pdf.save(`${sanitizeFileName(recipe.name)}.pdf`);

        return true;
    } finally {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }
};

export const generateMealPlanPDF = async (mealPlan) => {
    if (!mealPlan || !Array.isArray(mealPlan.days)) {
        throw new Error('Meal plan data is missing or invalid.');
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-100000px';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#0f172a';
    container.style.fontFamily = 'Arial, Helvetica, sans-serif';
    container.style.boxSizing = 'border-box';
    container.style.padding = '36px';
    container.style.zIndex = '-9999';

    const daysHtml = mealPlan.days
        .map(
            (day) => `
        <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; page-break-inside: avoid;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #059669; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; font-weight: bold;">
            📅 ${escapeHtml(day.dayName)}
          </h3>
          <div style="display: grid; gap: 10px;">
            ${day.meals
                .map(
                    (m) => `
              <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #10b981; margin-bottom: 2px;">
                  ${escapeHtml(m.type)}
                </div>
                <div style="font-size: 14px; font-weight: bold; color: #0f172a;">
                  ${m.recipe.img || ''} ${escapeHtml(m.recipe.name)}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                  ⏱️ ${escapeHtml(m.recipe.time || '')} • 🔥 ${escapeHtml(m.recipe.calories || '')} ${m.recipe.protein ? '• 🥩 ' + escapeHtml(m.recipe.protein) + ' Protein' : ''}
                </div>
              </div>
            `
                )
                .join('')}
          </div>
        </div>
      `
        )
        .join('');

    container.innerHTML = `
    <div style="width:100%;box-sizing:border-box;background:#ffffff;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #10b981;padding-bottom:12px;margin-bottom:20px;">
        <div>
          <h1 style="margin:0;font-size:24px;color:#0f172a;">ChefAI Weekly Meal Plan</h1>
          <p style="margin:4px 0 0 0;font-size:13px;color:#64748b;font-weight:bold;">${escapeHtml(mealPlan.preferencesSummary || '')}</p>
        </div>
        <div style="font-size:13px;color:#10b981;font-weight:bold;">ChefAI Assistant</div>
      </div>
      ${daysHtml}
    </div>
  `;

    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        const contentWidth = usableWidth;
        const contentHeight = (canvas.height * contentWidth) / canvas.width;

        let remainingHeight = contentHeight;
        let yPosition = margin;

        pdf.addImage(imageData, 'JPEG', margin, yPosition, contentWidth, contentHeight, undefined, 'FAST');
        remainingHeight -= usableHeight;

        while (remainingHeight > 0) {
            pdf.addPage();
            yPosition = margin - (contentHeight - remainingHeight);
            pdf.addImage(imageData, 'JPEG', margin, yPosition, contentWidth, contentHeight, undefined, 'FAST');
            remainingHeight -= usableHeight;
        }

        pdf.save('ChefAI_Meal_Plan.pdf');
        return true;
    } finally {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }
};

export const generateGroceryListPDF = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Grocery list is empty.');
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-100000px';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#0f172a';
    container.style.fontFamily = 'Arial, Helvetica, sans-serif';
    container.style.boxSizing = 'border-box';
    container.style.padding = '36px';
    container.style.zIndex = '-9999';

    const itemsHtml = items
        .map(
            (item) => `
        <div style="display:flex;align-items:center;padding:12px 16px;margin-bottom:8px;background:${item.checked ? '#f1f5f9' : '#ffffff'};border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;">
          <div style="font-size:16px;margin-right:12px;color:${item.checked ? '#10b981' : '#64748b'};font-weight:bold;">
            ${item.checked ? '☑' : '☐'}
          </div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:bold;color:${item.checked ? '#64748b' : '#0f172a'};text-decoration:${item.checked ? 'line-through' : 'none'};">
              ${escapeHtml(item.ingredient || (typeof item === 'string' ? item : ''))}
            </div>
            ${item.recipeName ? `<div style="font-size:12px;color:#059669;margin-top:2px;">From: ${escapeHtml(item.recipeName)}</div>` : ''}
          </div>
        </div>
      `
        )
        .join('');

    container.innerHTML = `
    <div style="width:100%;box-sizing:border-box;background:#ffffff;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #10b981;padding-bottom:12px;margin-bottom:20px;">
        <div>
          <h1 style="margin:0;font-size:24px;color:#0f172a;">ChefAI Grocery List</h1>
          <p style="margin:4px 0 0 0;font-size:13px;color:#64748b;font-weight:bold;">Total Items: ${items.length}</p>
        </div>
        <div style="font-size:14px;color:#10b981;font-weight:bold;">ChefAI Assistant</div>
      </div>
      <div style="display:flex;flex-direction:column;">
        ${itemsHtml}
      </div>
    </div>
  `;

    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        const contentWidth = usableWidth;
        const contentHeight = (canvas.height * contentWidth) / canvas.width;

        let remainingHeight = contentHeight;
        let yPosition = margin;

        pdf.addImage(imageData, 'JPEG', margin, yPosition, contentWidth, contentHeight, undefined, 'FAST');
        remainingHeight -= usableHeight;

        while (remainingHeight > 0) {
            pdf.addPage();
            yPosition = margin - (contentHeight - remainingHeight);
            pdf.addImage(imageData, 'JPEG', margin, yPosition, contentWidth, contentHeight, undefined, 'FAST');
            remainingHeight -= usableHeight;
        }

        pdf.save('ChefAI_Grocery_List.pdf');
        return true;
    } finally {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }
};